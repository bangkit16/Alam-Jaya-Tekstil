import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import TrackLog from "../lib/trackLog.js";
import {
  StatusPermintaan,
  StatusProses,
  StatusQC,
} from "../generated/prisma/enums.js";
import z from "zod";
import { Validator } from "../lib/validator.js";
import { getPagination, wrapPagination } from "../utils/pagination.js";
import { Prisma } from "../generated/prisma/browser.js";

export default class KurirController {
  public static async getDataMenunggu(req: Request, res: Response) {
    try {
      // 1. Ambil parameter dari Request dan siapkan argumen untuk Prisma
      const { prisma: pg, page, limit } = getPagination(req);

      const search = req.query.search as string;

      // Variabel filter agar konsisten antara query data dan count
      const whereCondition: Prisma.ProsesStokPotongWhereInput = {
        status: {
          in: [
            StatusProses.MENUNGGU_PENGIRIMAN,
            StatusProses.MENUNGGU_PENGIRIMAN_KE_QC,
          ],
        },
        kurir: {
          nama: {
            contains: search,
            mode: "insensitive",
          },
        },
        stokPotong: {
          permintaan: {
            namaBarang: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      };

      // 2. Jalankan kueri data dan hitung total secara paralel menggunakan Promise.all
      const [dataMenunggu, total] = await Promise.all([
        prisma.prosesStokPotong.findMany({
          where: whereCondition,
          ...pg, // 3. Gunakan spread prisma untuk skip dan take
          select: {
            id: true,
            penjahit: {
              select: {
                nama: true,
              },
            },
            status: true,
            stokPotong: {
              select: {
                kodeStokPotongan: true,
                jumlahLolos: true,
                permintaan: {
                  select: {
                    id: true,
                    namaBarang: true,
                    ukuran: true,
                    isUrgent: true,
                    jumlahMinta: true,
                    tanggalMasuk: true,
                  },
                },
              },
            },
          },
        }),
        prisma.prosesStokPotong.count({
          where: whereCondition,
        }),
      ]);

      // 4. Transformasi data (mapping) tetap dipertahankan sesuai logika asli
      const data = dataMenunggu.map((item) => ({
        idProsesStokPotong: item.id,
        namaBarang: item.stokPotong.permintaan.namaBarang,
        ukuran: item.stokPotong.permintaan.ukuran,
        dikirimDari:
          item.status == StatusProses.MENUNGGU_PENGIRIMAN
            ? "Stok Potong"
            : item.penjahit?.nama,
        dikirimKe:
          item.status == StatusProses.MENUNGGU_PENGIRIMAN_KE_QC
            ? "QC"
            : item.penjahit?.nama,
        isUrgent: item.stokPotong.permintaan.isUrgent,
        kodeStokPotongan: item.stokPotong.kodeStokPotongan,
        jumlahLolos: item.stokPotong.jumlahLolos,
      }));

      // 5. Format hasil akhir dengan properti data dan meta
      return res.status(200).json({
        data: data,
        meta: wrapPagination(total, page, limit),
      });
    } catch (error) {
      console.error("Error fetching data menunggu:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async updateProsesMenunggu(req: Request, res: Response) {
    const schema = z.object({
      params: z.object({ idProsesStokPotong: z.string().uuid() }),
      body: z.object({ idKurir: z.string() }),
    });
    try {
      const validated = Validator(schema)(req, res);
      if (!validated) return;
      const { idProsesStokPotong } = validated.params;
      const { idKurir } = validated.body;

      const kurir = await prisma.user.findFirst({
        where: {
          id: idKurir,
          role: "KURIR",
        },
      });

      if (!kurir) {
        return res.status(404).json({
          message: "Validasi gagal",
          errors: [
            "User tidak ditemukan atau user tersebut bukan merupakan KURIR.",
          ],
        });
      }

      const jenisProses = await prisma.prosesStokPotong.findUnique({
        where: {
          id: idProsesStokPotong,
          status: {
            in: [
              StatusProses.MENUNGGU_PENGIRIMAN,
              StatusProses.MENUNGGU_PENGIRIMAN_KE_QC,
            ],
          },
        },
        select: { status: true },
      });

      if (!jenisProses) {
        return res.status(404).json({
          message: "Validasi gagal",
          errors: ["Proses stok potong tidak ditemukan."],
        });
      }

      if (
        jenisProses.status !== StatusProses.MENUNGGU_PENGIRIMAN &&
        jenisProses.status !== StatusProses.MENUNGGU_PENGIRIMAN_KE_QC
      ) {
        return res.status(400).json({
          message: "Validasi gagal",
          errors: [
            "Proses stok potong bukan merupakan proses pengiriman ke QC.",
          ],
        });
      }

      if (jenisProses.status === StatusProses.MENUNGGU_PENGIRIMAN) {
        const prosesStokPotong = await prisma.prosesStokPotong.update({
          where: {
            id: idProsesStokPotong,
            status: StatusProses.MENUNGGU_PENGIRIMAN,
          },
          data: {
            tanggalBerangkat: new Date(),
            kurir: {
              connect: { id: idKurir },
            },
            status: StatusProses.PROSES_PENGIRIMAN,
            stokPotong: {
              update: {
                permintaan: {
                  update: {
                    status: StatusPermintaan.PROSES_KURIR,
                  },
                },
              },
            },
          },
          select: {
            kurir: {
              select: {
                nama: true,
                noHandphone: true,
              },
            },
            stokPotong: {
              select: {
                permintaan: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            penjahit: {
              select: {
                nama: true,
              },
            },
          },
        });

        TrackLog.logPermintaan(
          String(prosesStokPotong.stokPotong.permintaan.id),
          `Stok potongan sedang dikirimkan ke penjahit ${prosesStokPotong.penjahit?.nama} oleh kurir ${prosesStokPotong.kurir?.nama}, No HP: ${prosesStokPotong.kurir?.noHandphone} .`,
          StatusPermintaan.PROSES_KURIR,
        );

        return res.json({
          message: "Stok potongan sedang dikirimkan",
          status: StatusPermintaan.PROSES_KURIR,
        });
      } else if (
        jenisProses.status === StatusProses.MENUNGGU_PENGIRIMAN_KE_QC
      ) {
        const prosesStokPotong = await prisma.prosesStokPotong.update({
          where: {
            id: idProsesStokPotong,
            status: StatusProses.MENUNGGU_PENGIRIMAN_KE_QC,
          },
          data: {
            tanggalBerangkatKeQC: new Date(),
            kurirQC: {
              connect: { id: idKurir },
            },
            status: StatusProses.PROSES_PENGIRIMAN_KE_QC,
            stokPotong: {
              update: {
                permintaan: {
                  update: {
                    status: StatusPermintaan.PROSES_KURIR,
                  },
                },
              },
            },
          },
          select: {
            kurirQC: {
              select: {
                nama: true,
                noHandphone: true,
              },
            },
            stokPotong: {
              select: {
                permintaan: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        });

        TrackLog.logPermintaan(
          String(prosesStokPotong.stokPotong.permintaan.id),
          `Hasil Jahitan sedang dikirimkan ke QC oleh kurir ${prosesStokPotong.kurirQC?.nama}, No HP: ${prosesStokPotong.kurirQC?.noHandphone} .`,
          StatusPermintaan.PROSES_KURIR,
        );

        return res.json({
          message: "Hasil Jahitan sedang dikirimkan",
          status: StatusPermintaan.PROSES_KURIR,
        });
      }
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

  public static async getDataProses(req: Request, res: Response) {
    try {
      // 1. Ambil parameter pagination dari helper
      const { prisma: pg, page, limit } = getPagination(req);

      const search = req.query.search as string;

      // Filter yang konsisten untuk data dan count
      const whereCondition: Prisma.ProsesStokPotongWhereInput = {
        status: {
          in: [
            StatusProses.PROSES_PENGIRIMAN,
            StatusProses.PROSES_PENGIRIMAN_KE_QC,
          ],
        },
        kurir: {
          nama: {
            contains: search,
            mode: "insensitive",
          },
        },
        stokPotong: {
          permintaan: {
            namaBarang: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      };

      // 2. Gunakan Promise.all untuk eksekusi paralel (findMany & count)
      const [dataProses, total] = await Promise.all([
        prisma.prosesStokPotong.findMany({
          where: whereCondition,
          ...pg, // 3. Masukkan skip dan take ke kueri Prisma
          select: {
            id: true,
            tanggalBerangkat: true,
            status: true,
            penjahit: {
              select: {
                nama: true,
              },
            },
            kurir: {
              select: {
                nama: true,
              },
            },
            kurirQC: {
              select: {
                nama: true,
              },
            },
            stokPotong: {
              select: {
                kodeStokPotongan: true,
                jumlahLolos: true,
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
        }),
        prisma.prosesStokPotong.count({
          where: whereCondition,
        }),
      ]);

      // 4. Transformasi data (mapping) tetap dipertahankan sesuai aslinya
      const data = dataProses.map((item) => ({
        idProsesStokPotong: item.id,
        namaBarang: item.stokPotong.permintaan.namaBarang,
        ukuran: item.stokPotong.permintaan.ukuran,
        dikirimDari:
          item.status == StatusProses.PROSES_PENGIRIMAN
            ? "Stok Potong"
            : item.penjahit?.nama,
        dikirimKe:
          item.status == StatusProses.PROSES_PENGIRIMAN_KE_QC
            ? "QC"
            : item.penjahit?.nama,
        namaKurir:
          item.status == StatusProses.PROSES_PENGIRIMAN
            ? item.kurir?.nama
            : item.kurirQC?.nama,
        isUrgent: item.stokPotong.permintaan.isUrgent,
        kodeStokPotongan: item.stokPotong.kodeStokPotongan,
        jumlahLolos: item.stokPotong.jumlahLolos,
        tanggalBerangkat: item.tanggalBerangkat,
      }));

      // 5. Kembalikan response dengan format data dan meta
      return res.status(200).json({
        data: data,
        meta: wrapPagination(total, page, limit),
      });
    } catch (error) {
      console.error("Error fetching data proses:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async updateProsesSelesai(req: Request, res: Response) {
    const schema = z.object({
      params: z.object({ idProsesStokPotong: z.string().uuid() }),
    });
    try {
      const validated = Validator(schema)(req, res);
      if (!validated) return;

      const { idProsesStokPotong } = validated.params;

      if (!idProsesStokPotong) {
        return res
          .status(400)
          .json({ error: "ID proses stok potong tidak ditemukan" });
      }

      const jenisProses = await prisma.prosesStokPotong.findUnique({
        where: {
          id: idProsesStokPotong,
          status: {
            in: [
              StatusProses.PROSES_PENGIRIMAN,
              StatusProses.PROSES_PENGIRIMAN_KE_QC,
            ],
          },
        },
        select: { status: true },
      });

      if (!jenisProses) {
        return res.status(404).json({
          message: "Validasi gagal",
          errors: ["Proses stok potong tidak ditemukan."],
        });
      }

      if (
        jenisProses.status !== StatusProses.PROSES_PENGIRIMAN &&
        jenisProses.status !== StatusProses.PROSES_PENGIRIMAN_KE_QC
      ) {
        return res.status(400).json({
          message: "Validasi gagal",
          errors: [
            "Proses stok potong bukan merupakan proses pengiriman ke QC.",
          ],
        });
      }

      if (jenisProses.status === StatusProses.PROSES_PENGIRIMAN) {
        const prosesStokPotong = await prisma.prosesStokPotong.update({
          where: {
            id: idProsesStokPotong,
            status: StatusProses.PROSES_PENGIRIMAN,
          },
          data: {
            tanggalSampai: new Date(),
            status: StatusProses.SELESAI_PENGIRIMAN,
            stokPotong: {
              update: {
                permintaan: {
                  update: {
                    status: StatusPermintaan.PROSES_KURIR,
                  },
                },
              },
            },
          },
          select: {
            kurir: {
              select: {
                nama: true,
                noHandphone: true,
              },
            },
            stokPotong: {
              select: {
                permintaan: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            penjahit: {
              select: {
                nama: true,
              },
            },
          },
        });

        TrackLog.logPermintaan(
          String(prosesStokPotong.stokPotong.permintaan.id),
          `Stok potongan sudah sampai di penjahit ${prosesStokPotong.penjahit?.nama} oleh kurir ${prosesStokPotong.kurir?.nama}, No HP: ${prosesStokPotong.kurir?.noHandphone} .`,
          StatusPermintaan.PROSES_KURIR,
        );

        return res.json({
          message: "Stok potongan sedang dikirimkan",
          status: StatusPermintaan.PROSES_KURIR,
        });
      } else if (jenisProses.status === StatusProses.PROSES_PENGIRIMAN_KE_QC) {
        const prosesStokPotong = await prisma.prosesStokPotong.update({
          where: {
            id: idProsesStokPotong,
            status: StatusProses.PROSES_PENGIRIMAN_KE_QC,
          },
          data: {
            tanggalSampaiKeQC: new Date(),
            status: StatusProses.SELESAI_PENGIRIMAN_KE_QC,
            stokPotong: {
              update: {
                permintaan: {
                  update: {
                    status: StatusPermintaan.MENUNGGU_QC,
                  },
                },
              },
            },
          },
          select: {
            kurirQC: {
              select: {
                nama: true,
                noHandphone: true,
              },
            },
            stokPotong: {
              select: {
                id: true,
                permintaan: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        });

        await prisma.qCStokPotong.create({
          data: {
            stokPotong: {
              connect: {
                id: prosesStokPotong.stokPotong.id,
              },
            },
            status: StatusQC.MENUNGGU,
          },
        });

        TrackLog.logPermintaan(
          String(prosesStokPotong.stokPotong.permintaan.id),
          `Hasil Jahitan sudah sampai di QC oleh kurir ${prosesStokPotong.kurirQC?.nama}, No HP: ${prosesStokPotong.kurirQC?.noHandphone} .`,
          StatusPermintaan.MENUNGGU_QC,
        );

        return res.json({
          message: "Hasil Jahitan sedang dikirimkan",
          status: StatusPermintaan.MENUNGGU_QC,
        });
      }
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message:
            "ID Proses Stok Potong tidak ditemukan atau sudah diproses sebelumnya",
        });
      }
      console.error("Error updating proses stok potong:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async getDataSelesai(req: Request, res: Response) {
    try {
      const { page, limit } = getPagination(req);
      const search = (req.query.search as string) || "";

      const whereCondition: Prisma.ProsesStokPotongWhereInput = {
        status: {
          in: [
            StatusProses.SELESAI_PENGIRIMAN,
            StatusProses.SELESAI_PENGIRIMAN_KE_QC,
          ],
        },
        OR: [
          {
            kurir: {
              nama: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
          {
            stokPotong: {
              permintaan: {
                namaBarang: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      };

      // ambil semua dulu
      const rows = await prisma.prosesStokPotong.findMany({
        where: whereCondition,
        select: {
          id: true,
          tanggalSampai: true,
          tanggalBerangkat: true,
          tanggalSampaiKeQC: true,
          tanggalBerangkatKeQC: true,
          status: true,
          jumlahSelesai: true,

          kurir: { select: { nama: true } },
          kurirQC: { select: { nama: true } },
          penjahit: { select: { nama: true } },

          stokPotong: {
            select: {
              jumlahLolos: true,
              permintaan: {
                select: {
                  namaBarang: true,
                  isUrgent: true,
                },
              },
            },
          },
        },
      });

      // bikin histori rows
      const mappedData = rows.flatMap((item) => {
        const result: any[] = [];

        if (item.tanggalSampai) {
          result.push({
            idProsesStokPotong: item.id,
            namaBarang: item.stokPotong.permintaan.namaBarang,
            dikirimDari: "Stok Potong",
            dikirimKe: `Penjahit (${item.penjahit?.nama})`,
            namaKurir: item.kurir?.nama,
            isUrgent: item.stokPotong.permintaan.isUrgent,
            jumlah: item.stokPotong.jumlahLolos,
            tanggalBerangkat: item.tanggalBerangkat,
            tanggalSampai: item.tanggalSampai,
            status: StatusProses.SELESAI_PENGIRIMAN,
          });
        }

        if (item.tanggalSampaiKeQC) {
          result.push({
            idProsesStokPotong: item.id,
            namaBarang: item.stokPotong.permintaan.namaBarang,
            dikirimDari: `Penjahit (${item.penjahit?.nama})`,
            dikirimKe: "QC",
            namaKurir: item.kurirQC?.nama,
            isUrgent: item.stokPotong.permintaan.isUrgent,
            jumlah: item.jumlahSelesai,
            tanggalBerangkat: item.tanggalBerangkatKeQC,
            tanggalSampai: item.tanggalSampaiKeQC,
            status: StatusProses.SELESAI_PENGIRIMAN_KE_QC,
          });
        }

        return result;
      });

      // pagination setelah flatmap
      const total = mappedData.length;

      const start = (page - 1) * limit;
      const end = start + limit;

      const paginated = mappedData.slice(start, end);

      return res.status(200).json({
        data: paginated,
        meta: wrapPagination(total, page, limit),
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }

  public static async getListKurir(req: Request, res: Response) {
    try {
      const kurir = await prisma.user.findMany({
        where: { role: "KURIR" },
        select: {
          id: true,
          nama: true,
        },
      });
      return res.status(200).json(kurir);
    } catch (error) {
      console.error("Error fetching kurir data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
