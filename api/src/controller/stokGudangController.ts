import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import TrackLog from "../lib/trackLog.js";
import {
  JenisPermintaan,
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

export default class StokGudangController {
  public static async getBoxMasuk(req: Request, res: Response) {
    try {
      // 1. Ambil parameter pagination menggunakan helper
      const { prisma: pg, page, limit } = getPagination(req);

      const search = req.query.search as string;

      // Filter yang konsisten untuk kueri data dan penghitungan total
      const whereCondition: Prisma.BoxWhereInput = {
        status: StatusBox.MENUNGGU,

        ...(search && {
          OR: [
            {
              namaBox: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              kodeBox: {
                contains: search,
                mode: "insensitive",
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
            tanggalMasuk: true,
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
        tanggalMasukStok: item.tanggalMasuk,
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
        where: { id: idPenerimaBox },
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
        where: { id: idBox, status: StatusBox.MENUNGGU },
        select: {
          qc: {
            select: {
              id: true,
            },
          },
        },
        data: {
          status: StatusBox.ACC,
          tanggalMasukGudang: new Date(),
          penerima: {
            connect: {
              id: idPenerimaBox,
            },
          },
        },
      });

      box.qc.forEach(async (qc) => {
        TrackLog.logPermintaan(
          qc.stokPotong.permintaan.id,
          `Permintaan ${qc.stokPotong.permintaan.namaBarang} ${qc.stokPotong.permintaan.ukuran} berada di dalam BOX: ${box.namaBox}, KODE BOX: ${box.kodeBox}. Sudah diterima di Gudang`,
          StatusPermintaan.ACC_GUDANG,
        );
        await prisma.permintaan.update({
          where: { id: qc.stokPotong.permintaan.id },
          data: {
            status: StatusPermintaan.ACC_GUDANG,
          },
        });
      });

      return res.status(200).json({
        message: "Box dan QC berhasil diterima",
        status: "ACC_GUDANG",
      });
    } catch (error: any) {
      if (error.code === "P2025") {
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
        status: { in: [StatusBox.ACC, StatusBox.KIRIM] },

        ...(search && {
          OR: [
            {
              namaBox: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              kodeBox: {
                contains: search,
                mode: "insensitive",
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

  public static async getDataPermintaan(req: Request, res: Response) {
    try {
      // 1. Ambil parameter pagination menggunakan helper
      const { prisma: pg, page, limit } = getPagination(req);

      const search = req.query.search as string;

      // Filter yang konsisten untuk data dan total count
      const whereCondition: Prisma.PermintaanProdukWhereInput = {
        StatusPermintaan: {
          in: [
            StatusPermintaanProduk.DIPROSES,
            StatusPermintaanProduk.MENUNGGU,
          ],
        },

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

      // 2. Gunakan Promise.all untuk eksekusi findMany dan count secara paralel
      const [permintaan, total] = await Promise.all([
        prisma.permintaanProduk.findMany({
          where: whereCondition,
          ...pg, // 3. Masukkan skip & take dari helper ke argumen Prisma
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

      // 4. Transformasi data (mapping) tanpa mengubah struktur asli
      const data = permintaan.map((item: any) => ({
        idPermintaan: item.id,
        namaBarang: item.namaBarang,
        kategori: item.kategori.namaKategori,
        jenisPermintaan: item.jenisPermintaan,
        ukuran: item.ukuran,
        isUrgent: item.isUrgent,
        jumlahMinta: item.jumlahMinta,
        statusPermintaan: item.StatusPermintaan,
        tanggalMasukPermintaan: item.tanggalPermintaan,
      }));

      // 5. Format hasil akhir dengan properti data dan meta
      return res.status(200).json({
        data: data,
        meta: wrapPagination(total, page, limit),
      });
    } catch (error) {
      console.error("Error fetching permintaan data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async updateStatusPermintaan(req: Request, res: Response) {
    try {
      const { idPermintaan } = req.params;
      if (!idPermintaan) {
        return res
          .status(400)
          .json({ message: "ID permintaan tidak ditemukan" });
      }

      if (Array.isArray(idPermintaan)) {
        // Handle the case where idPermintaan is an array
        return res
          .status(400)
          .json({ message: "ID permintaan must be a single value" });
      }

      const permintaanProduk = await prisma.permintaanProduk.update({
        where: { id: String(idPermintaan) },
        data: {
          StatusPermintaan: StatusPermintaanProduk.DIPROSES,
        },
        select: {
          id: true,
          namaBarang: true,
          kategori: {
            select: {
              id: true,
            },
          },
          jenisPermintaan: true,
          ukuran: true,
          isUrgent: true,
          jumlahMinta: true,
        },
      });

      if (!permintaanProduk) {
        return res
          .status(404)
          .json({ message: "Permintaan Produk tidak ditemukan" });
      }

      const newPermintaan = await prisma.permintaan.create({
        data: {
          namaBarang: permintaanProduk.namaBarang,
          kategoriId: permintaanProduk.kategori.id,
          jenisPermintaan: permintaanProduk.jenisPermintaan,
          ukuran:
            UkuranProduk[permintaanProduk.ukuran as keyof typeof UkuranProduk],
          isUrgent: permintaanProduk.isUrgent,
          jumlahMinta: permintaanProduk.jumlahMinta,
          status: StatusPermintaan.MENUNGGU_POTONG,
        },
        select: {
          id: true,
        },
      });

      await prisma.permintaanProduk.update({
        where: { id: String(idPermintaan) },
        data: {
          permintaan: {
            connect: {
              id: newPermintaan.id,
            },
          },
        },
      });

      await TrackLog.logPermintaan(
        newPermintaan.id,
        "Permintaan potong berhasil dibuat",
        StatusPermintaan.MENUNGGU_POTONG,
      );

      return res.status(200).json({
        message: "Permintaan berhasil dipindahkan ke potong",
        status: "MENUNGGU_POTONG",
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res
          .status(404)
          .json({ message: "Permintaan tidak ditemukan atau sudah diproses" });
      }
      console.error("Error updating permintaan status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async updateBoxKirimKeResi(req: Request, res: Response) {
    const schema = z.object({
      params: z.object({ idPermintaanProduk: z.string().uuid() }),
      body: z.object({
        idPenanggungJawab: z.string().uuid(),
        idBox: z.preprocess(
          (val) => (Array.isArray(val) ? val : [val]),
          z.array(z.string().uuid()),
        ),
      }),
    });

    try {
      const validated = Validator(schema)(req, res);
      if (!validated) return;

      const { idPermintaanProduk } = validated.params;
      const { idBox, idPenanggungJawab } = validated.body;

      // 1. Validasi Keberadaan Data secara Parallel (Efisiensi)
      const [penanggungJawab, permintaanExists, existingBoxes] =
        await Promise.all([
          prisma.user.findUnique({ where: { id: idPenanggungJawab } }),
          prisma.permintaanProduk.findUnique({
            where: { id: idPermintaanProduk },
          }),
          prisma.box.findMany({ where: { id: { in: idBox } } }),
        ]);

      // ERROR HANDLER: idPenanggungJawab
      if (!penanggungJawab) {
        return res
          .status(404)
          .json({ message: "Penanggung Jawab tidak ditemukan" });
      }

      // ERROR HANDLER: idPermintaanProduk
      if (!permintaanExists) {
        return res
          .status(404)
          .json({ message: "Permintaan Produk tidak ditemukan" });
      }

      // ERROR HANDLER: idBox (Mengecek apakah semua ID yang dikirim ada di database)
      if (existingBoxes.length !== idBox.length) {
        const foundIds = existingBoxes.map((b) => b.id);
        const missingIds = idBox.filter((id) => !foundIds.includes(id));
        return res.status(404).json({
          message: "Beberapa ID Box tidak ditemukan",
          missingIds,
        });
      }

      // Gunakan $transaction agar kedua proses (update box & update relasi) berjalan bersamaan
      const result = await prisma.$transaction([
        // 1. Update status semua box yang ada di dalam array idBox
        prisma.box.updateMany({
          where: {
            id: { in: idBox },
          },
          data: {
            status: StatusBox.MASUK_STOK_RESI, // Sesuaikan dengan nama field dan value status Anda
            penanggungJawab: {
              connect: {
                id: idPenanggungJawab,
              },
            },
            tanggalMasukStokResi: new Date(),
          },
        }),

        // 2. Hubungkan box tersebut ke PermintaanProduk (seperti kode awal Anda)
        prisma.permintaanProduk.update({
          where: { id: idPermintaanProduk },
          data: {
            box: {
              connect: idBox.map((id) => ({ id })),
            },
            StatusPermintaan: StatusPermintaanProduk.SELESAI,
          },
        }),
      ]);

      return res.status(200).json({
        message: "Box berhasil dikirim ke STOK resi",
        data: "DIKIRIM KE RESI", // mengembalikan hasil permintaanProduk
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Terjadi kesalahan server" });
    }
  }

  public static async getTrackingPermintaan(req: Request, res: Response) {
    try {
      const { idPermintaan } = req.params;
      if (!idPermintaan) {
        return res
          .status(400)
          .json({ message: "ID permintaan tidak ditemukan" });
      }
      if (Array.isArray(idPermintaan)) {
        // Handle the case where idPermintaan is an array
        return res
          .status(400)
          .json({ message: "ID permintaan must be a single value" });
      }
      const permintaan = await prisma.permintaan.findUnique({
        where: { id: String(idPermintaan) },
        select: {
          id: true,
          namaBarang: true,
          kategori: true,
          jenisPermintaan: true,
          ukuran: true,
          isUrgent: true,
          jumlahMinta: true,
          tanggalMasuk: true,
        },
      });
      const permintaanLog = await prisma.permintaanLog.findMany({
        where: { permintaanId: String(idPermintaan) },
        select: {
          id: true,
          keterangan: true,
          status: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc", // Bagus untuk ditambahkan agar log berurutan secara kronologis
        },
      });

      if (!permintaanLog || permintaanLog.length === 0) {
        return res.status(404).json({ message: "Permintaan tidak ditemukan" });
      }

      const dataLog = permintaanLog.map((log) => {
        const formattedDate = new Intl.DateTimeFormat("id-ID", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(log.createdAt));

        return {
          tanggal: formattedDate,
          keterangan: log.keterangan,
          status: log.status,
        };
      });
      const data = {
        idPermintaan: permintaan?.id,
        namaBarang: permintaan?.namaBarang,
        kategori: permintaan?.kategori?.namaKategori,
        jenisPermintaan: permintaan?.jenisPermintaan,
        ukuran: permintaan?.ukuran,
        isUrgent: permintaan?.isUrgent,
        jumlahMinta: permintaan?.jumlahMinta,
        tanggalMasukPermintaan: permintaan?.tanggalMasuk,
        logPermintaan: dataLog || [], // Hasilnya adalah array of objects
      };

      return res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching permintaan data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async getDataPermintaanPotong(req: Request, res: Response) {
    try {
      // 1. Ambil parameter pagination menggunakan helper
      const { prisma: pg, page, limit } = getPagination(req);

      const search = req.query.search as string;

      // Filter yang konsisten untuk kueri data dan penghitungan total
      const whereCondition: Prisma.PermintaanWhereInput = {
        status: { notIn: [StatusPermintaan.MENUNGGU_GUDANG] },

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

      // 2. Gunakan Promise.all untuk eksekusi findMany dan count secara paralel
      const [permintaan, total] = await Promise.all([
        prisma.permintaan.findMany({
          where: whereCondition,
          ...pg, // 3. Masukkan skip & take dari helper ke argumen Prisma
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
            tanggalMasuk: true,
            status: true,
          },
        }),
        prisma.permintaan.count({
          where: whereCondition,
        }),
      ]);

      // 4. Transformasi data (mapping) tanpa mengubah struktur asli
      const data = permintaan.map((item: any) => ({
        idPermintaan: item.id,
        namaBarang: item.namaBarang,
        kategori: item.kategori.namaKategori,
        jenisPermintaan: item.jenisPermintaan,
        ukuran: item.ukuran,
        isUrgent: item.isUrgent,
        jumlahMinta: item.jumlahMinta,
        tanggalMasukPermintaan: item.tanggalMasuk,
        status: item.status,
      }));

      // 5. Format hasil akhir dengan properti data dan meta
      return res.status(200).json({
        data: data,
        meta: wrapPagination(total, page, limit),
      });
    } catch (error) {
      console.error("Error fetching permintaan data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async createPermintaanPotong(req: Request, res: Response) {
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

      const newPermintaan = await prisma.permintaan.create({
        data: {
          namaBarang,
          kategoriId: kategoriData.id,
          jenisPermintaan: JenisPermintaan.GUDANG,
          ukuran: UkuranProduk[ukuran as keyof typeof UkuranProduk],
          isUrgent,
          jumlahMinta,
          status: StatusPermintaan.MENUNGGU_POTONG,
        },
      });

      await TrackLog.logPermintaan(
        newPermintaan.id,
        "Permintaan potong berhasil dibuat",
        StatusPermintaan.MENUNGGU_POTONG,
      );

      return res.json({
        message: "Permintaan potong berhasil dikirim",
        status: StatusPermintaan.MENUNGGU_POTONG,
        // data: newPermintaan,
      });
    } catch (error) {
      console.error("Error create permintaan:", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  }

  public static async getListPenerimaBox(req: Request, res: Response) {
    try {
      const penerimaBox = await prisma.user.findMany({
        where: { role: "STOK_GUDANG" },
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
  public static async getListPenanggungJawabBox(req: Request, res: Response) {
    try {
      const penanggungJawab = await prisma.user.findMany({
        where: { role: "STOK_GUDANG" },
        select: {
          id: true,
          nama: true,
        },
      });
      return res.status(200).json(penanggungJawab);
    } catch (error) {
      console.error("Error fetching penanggungJawab data:", error);
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
