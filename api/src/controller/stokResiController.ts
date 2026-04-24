import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import TrackLog from "../lib/trackLog.js";
import {
  JenisPermintaan,
  Role,
  StatusBox,
  StatusPermintaan,
  StatusPermintaanProduk,
  StatusQC,
  UkuranProduk,
} from "../generated/prisma/enums.js";
import z from "zod";
import { Validator } from "../lib/validator.js";
import { getPagination, wrapPagination } from "../utils/pagination.js";
import { Prisma } from "../generated/prisma/browser.js";

export class StokResiController {
  public static async getBoxMasuk(req: Request, res: Response) {
    try {
      // 1. Ambil parameter pagination menggunakan helper
      const { prisma: pg, page, limit } = getPagination(req);

      const search = req.query.search as string;

      // Filter yang konsisten untuk kueri data dan penghitungan total
      const whereCondition: Prisma.BoxWhereInput = {
        status: StatusBox.MASUK_STOK_RESI,

        ...(search && {
          OR: [
            {
              namaBox: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              qc: {
                every: {
                  stokPotong: {
                    permintaan: {
                      namaBarang: {
                        contains: search,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              },
            },
          ],
        }),
      };

      // 2. Gunakan Promise.all untuk eksekusi kueri data dan count secara paralel
      const [data, total] = await Promise.all([
        prisma.box.findMany({
          where: whereCondition,
          ...pg, // 3. Masukkan spread prisma (skip & take) dari helper
          select: {
            id: true,
            namaBox: true,
            kodeBox: true,
            tanggalMasukStokResi: true,
            penanggungJawab: {
              select: {
                nama: true,
                noHandphone: true,
              },
            },
            qc: {
              select: {
                tanggalSelesaiQC: true,
                id: true,
                jumlahLolos: true,
                stokPotong: {
                  select: {
                    kodeStokPotongan: true,
                    permintaan: {
                      select: {
                        id: true,
                        namaBarang: true,
                        ukuran: true,
                        isUrgent: true,
                      },
                    },
                  },
                },
              },
            },
          },
        }),
        prisma.box.count({
          where: whereCondition,
        }),
      ]);

      // 4. Transformasi data (mapping) tetap dipertahankan sesuai logika asli
      const mappedData = data.map((item) => ({
        idBox: item.id,
        namaBox: item.namaBox,
        namaPenanggungJawab: item.penanggungJawab?.nama,
        kodeBox: item.kodeBox,
        tanggalMasukStok: item.tanggalMasukStokResi,
        stokPotongan: item.qc.map((q) => ({
          idQC: q.id,
          namaBarang: q.stokPotong.permintaan.namaBarang,
          ukuran: q.stokPotong.permintaan.ukuran,
          jumlah: q.jumlahLolos,
          tanggalSelesaiQC: q.tanggalSelesaiQC,
          kodeStokPotongan: q.stokPotong.kodeStokPotongan,
          isUrgent: q.stokPotong.permintaan.isUrgent,
        })),
      }));

      // 5. Kembalikan response dengan format data dan meta
      return res.status(200).json({
        data: mappedData,
        meta: wrapPagination(total, page, limit),
      });
    } catch (error) {
      console.error("Error fetching data selesai:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async updateAccBoxMasuk(req: Request, res: Response) {
    const schema = z.object({
      params: z.object({ idBox: z.string().uuid() }),
      body: z.object({ idPenerimaBox: z.string().uuid() }),
    });

    try {
      const validated = Validator(schema)(req, res);
      if (!validated) return;
      const { idBox } = validated.params;
      const { idPenerimaBox } = validated.body;

      const penerimaBox = await prisma.user.findUnique({
        where: { id: idPenerimaBox, role: Role.STOK_RESI },
        select: { id: true },
      });

      const box = await prisma.box.findUnique({
        where: { id: idBox },
        include: {
          qc: {
            include: {
              stokPotong: {
                include: {
                  permintaan: true,
                },
              },
            },
          },
        },
      });

      if (!penerimaBox) {
        return res
          .status(404)
          .json({ message: "Penerima box tidak ditemukan" });
      }

      if (!box) {
        return res.status(404).json({ message: "Box tidak ditemukan" });
      }

      const updateBox = await prisma.box.update({
        where: { id: idBox, status: { in: [StatusBox.MASUK_STOK_RESI] } },
        data: {
          status: StatusBox.ACC_STOK_RESI,
          tanggalACCStokResi: new Date(),

          penerimaResi: {
            connect: {
              id: idPenerimaBox,
            },
          },
        },
      });

      box.qc.forEach(async (qc) => {
        TrackLog.logPermintaan(
          qc.stokPotong.permintaan.id,
          `Permintaan ${qc.stokPotong.permintaan.namaBarang} ${qc.stokPotong.permintaan.ukuran} berada di dalam BOX: ${box.namaBox}, KODE BOX: ${box.kodeBox}. Sudah diterima di Stok RESI`,
          StatusPermintaan.KIRIM_RESI,
        );
        await prisma.permintaan.update({
          where: { id: qc.stokPotong.permintaan.id },
          data: {
            status: StatusPermintaan.KIRIM_RESI,
          },
        });
      });

      return res.status(200).json({
        message: "Box berhasil diterima di Stok RESI",
        status: "ACC_GUDANG",
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        console.error("Error updating permintaan status:", error);
        return res.status(404).json({
          message:
            "ID Permintaan tidak ditemukan atau sudah diproses sebelumnya",
        });
      }

      console.error("Error updating permintaan status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async getDataBox(req: Request, res: Response) {
    try {
      // 1. Ambil parameter pagination menggunakan helper
      const { prisma: pg, page, limit } = getPagination(req);

      const search = req.query.search as string;

      // Filter yang konsisten untuk data dan total count
      const whereCondition: Prisma.BoxWhereInput = {
        status: { in: [StatusBox.ACC_STOK_RESI] },

        ...(search && {
          OR: [
            {
              namaBox: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              qc: {
                every: {
                  stokPotong: {
                    permintaan: {
                      namaBarang: {
                        contains: search,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              },
            },
          ],
        }),
      };

      // 2. Gunakan Promise.all untuk eksekusi findMany dan count secara paralel
      const [data, total] = await Promise.all([
        prisma.box.findMany({
          where: whereCondition,
          ...pg, // 3. Masukkan skip & take dari helper ke argumen Prisma
          select: {
            id: true,
            namaBox: true,
            kodeBox: true,
            tanggalMasukGudang: true,
            penerima: {
              select: {
                nama: true,
                noHandphone: true,
              },
            },
            qc: {
              select: {
                tanggalSelesaiQC: true,
                id: true,
                jumlahLolos: true,
                stokPotong: {
                  select: {
                    kodeStokPotongan: true,
                    permintaan: {
                      select: {
                        id: true,
                        namaBarang: true,
                        ukuran: true,
                        isUrgent: true,
                      },
                    },
                  },
                },
              },
            },
          },
        }),
        prisma.box.count({
          where: whereCondition,
        }),
      ]);

      // 4. Transformasi data (mapping) tanpa mengubah struktur asli
      const mappedData = data.map((item) => ({
        idBox: item.id,
        namaBox: item.namaBox,
        namaPenerimaBox: item.penerima?.nama,
        kodeBox: item.kodeBox,
        tanggalMasukGudang: item.tanggalMasukGudang,
        stokPotongan: item.qc.map((q) => ({
          idQC: q.id,
          namaBarang: q.stokPotong.permintaan.namaBarang,
          ukuran: q.stokPotong.permintaan.ukuran,
          jumlah: q.jumlahLolos,
          tanggalSelesaiQC: q.tanggalSelesaiQC,
          kodeStokPotongan: q.stokPotong.kodeStokPotongan,
          isUrgent: q.stokPotong.permintaan.isUrgent,
        })),
      }));

      // 5. Format hasil akhir dengan properti data dan meta
      return res.status(200).json({
        data: mappedData,
        meta: wrapPagination(total, page, limit),
      });
    } catch (error) {
      console.error("Error fetching data selesai:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async getListPermintaanProduk(req: Request, res: Response) {
    try {
      const { prisma: pg, page, limit } = getPagination(req);

      const search = req.query.search as string;

      const whereCondition: Prisma.PermintaanProdukWhereInput = {
        StatusPermintaan: { notIn: [StatusPermintaanProduk.BATAL] },

        ...(search && {
          OR: [
            {
              namaBarang: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }),
      };

      const [permintaanProduk, total] = await Promise.all([
        prisma.permintaanProduk.findMany({
          where: whereCondition,
          ...pg,
          select: {
            id: true,
            namaBarang: true,
            kategori: {
              select: {
                namaKategori: true,
              },
            },
            jenisPermintaan: true,
            ukuran: true,
            isUrgent: true,
            jumlahMinta: true,
            tanggalPermintaan: true,
            StatusPermintaan: true,
          },
        }),
        prisma.permintaanProduk.count({
          where: whereCondition,
        }),
      ]);

      const data = permintaanProduk.map((item: any) => ({
        idPermintaanProduk: item.id,
        namaBarang: item.namaBarang,
        kategori: item.kategori.namaKategori,
        jenisPermintaan: item.jenisPermintaan,
        ukuran: item.ukuran,
        status: item.StatusPermintaan,
        isUrgent: item.isUrgent,
        jumlahMinta: item.jumlahMinta,
        tanggalPermintaan: item.tanggalMasuk,
      }));

      return res.status(200).json({
        data: data,
        meta: wrapPagination(total, page, limit),
      });
    } catch (error: any) {
      console.error("Error create permintaan produk:", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  public static async createPermintaanProduk(req: Request, res: Response) {
    const schema = z.object({
      body: z.object({
        namaBarang: z.string().min(1, "Nama barang harus diisi"),
        kategori: z.string().min(1, "Kategori harus dipilih"),
        ukuran: z.string().min(1, "Ukuran harus diisi"),
        isUrgent: z.boolean("Urgent harus berisi true/false").default(false),
        jumlahMinta: z.number().positive("Jumlah harus lebih dari 0"),
      }),
    });
    try {
      const validated = Validator(schema)(req, res);
      if (!validated) return;

      const { namaBarang, kategori, ukuran, isUrgent, jumlahMinta } =
        validated.body;

      const kategoriData = await prisma.kategori.findUnique({
        where: {
          slug: kategori,
        },
      });

      if (!kategoriData) {
        return res.status(400).json({
          message: "Kategori tidak ditemukan",
        });
      }

      const newPermintaan = await prisma.permintaanProduk.create({
        data: {
          namaBarang,
          kategoriId: kategoriData.id,
          jenisPermintaan: JenisPermintaan.RESI,
          ukuran: UkuranProduk[ukuran as keyof typeof UkuranProduk],
          isUrgent,
          jumlahMinta,
          StatusPermintaan: StatusPermintaanProduk.MENUNGGU,
        },
      });

      return res.json({
        message: "Permintaan produk berhasil dikirim",
        status: StatusPermintaanProduk.MENUNGGU,
        // data: newPermintaan,
      });
    } catch (error) {
      console.error("Error create permintaan produk:", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  public static async putCancelPermintaanProduk(req: Request, res: Response) {}

  public static async getTrackingPermintaanProduk(req: Request, res: Response) {
    try {
      const { idPermintaan } = req.params;

      if (!idPermintaan || Array.isArray(idPermintaan)) {
        return res.status(400).json({
          message: idPermintaan
            ? "ID permintaan must be a single value"
            : "ID permintaan tidak ditemukan",
        });
      }

      // 1. Ambil data PermintaanProduk beserta relasi Permintaan-nya dalam satu query
      const permintaanProduk = await prisma.permintaanProduk.findUnique({
        where: { id: String(idPermintaan) },
        select: {
          id: true,
          namaBarang: true,
          kategori: { select: { namaKategori: true } },
          jenisPermintaan: true,
          ukuran: true,
          isUrgent: true,
          jumlahMinta: true,
          tanggalPermintaan: true,
          StatusPermintaan: true,
          permintaanId: true,
          permintaan: {
            select: {
              id: true,
              namaBarang: true,
              kategori: { select: { namaKategori: true } },
              jenisPermintaan: true,
              ukuran: true,
              isUrgent: true,
              jumlahMinta: true,
              tanggalMasuk: true,
            },
          },
        },
      });

      if (!permintaanProduk) {
        return res.status(404).json({ message: "Permintaan tidak ditemukan" });
      }

      // 2. Logic Log: Jika status MENUNGGU, log otomatis kosong. Jika tidak, ambil dari DB.
      let dataLog: any[] = [];
      if (permintaanProduk.StatusPermintaan !== "MENUNGGU") {
        const permintaanLog = await prisma.permintaanLog.findMany({
          where: { permintaanId: String(idPermintaan) },
          select: {
            keterangan: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "asc" },
        });

        dataLog = permintaanLog.map((log) => ({
          tanggal: new Intl.DateTimeFormat("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(log.createdAt)),
          keterangan: log.keterangan,
          status: log.status,
        }));
      }

      // 3. Tentukan sumber data (prioritaskan data dari relasi 'permintaan' jika ada)
      const dataSource = permintaanProduk.permintaan || permintaanProduk;

      const data = {
        idPermintaan: permintaanProduk.id,
        namaBarang: dataSource.namaBarang,
        kategori: dataSource.kategori?.namaKategori || null,
        jenisPermintaan: dataSource.jenisPermintaan,
        ukuran: dataSource.ukuran,
        status: permintaanProduk.StatusPermintaan,
        isUrgent: dataSource.isUrgent,
        jumlahMinta: dataSource.jumlahMinta,
        // Gunakan tanggalMasuk jika dari relasi 'permintaan', jika tidak gunakan tanggalPermintaan
        tanggalMasukPermintaan:
          (dataSource as any).tanggalMasuk ||
          (dataSource as any).tanggalPermintaan,
        logPermintaan: dataLog,
      };

      return res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching permintaan data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async getListPenerimaBox(req: Request, res: Response) {
    try {
      const penerimaBox = await prisma.user.findMany({
        where: { role: "STOK_RESI" },
        select: {
          id: true,
          nama: true,
        },
      });
      return res.status(200).json(penerimaBox);
    } catch (error) {
      console.error("Error fetching penerimaBox data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  public static async getListPemroses(req: Request, res: Response) {
    try {
      const pemroses = await prisma.user.findMany({
        where: { role: "STOK_RESI" },
        select: {
          id: true,
          nama: true,
        },
      });
      return res.status(200).json(pemroses);
    } catch (error) {
      console.error("Error fetching pemroses data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async getListKategori(req: Request, res: Response) {
    try {
      const kategori = await prisma.kategori.findMany({
        select: {
          id: true,
          slug: true,
          namaKategori: true,
        },
      });
      return res.status(200).json(kategori);
    } catch (error) {
      console.error("Error fetching kategori data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
