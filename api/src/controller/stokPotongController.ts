import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import {
  StatusPermintaan,
  StatusProses,
  StatusStokPotong,
} from "../generated/prisma/enums.js";
import TrackLog from "../lib/trackLog.js";
import z from "zod";
import { Validator } from "../lib/validator.js";
// import { UkuranProduk } from "../generated/prisma/enums";
export default class StokPotongController {
  public static async getDataMenunggu(req: Request, res: Response) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Implementation for fetching selesai data
        const dataMenunggu = await tx.permintaan.findMany({
          where: { status: "MENUNGGU_STOK_POTONG" },
          select: {
            id: true,
            namaBarang: true,
            ukuran: true,
            tanggalMasuk: true,
            stokPotong: {
              select: {
                pemotong: {
                  select: {
                    user: {
                      select: {
                        nama: true,
                      },
                    },
                  },
                },
                id: true,
                kodeKain: true,
                jumlahHasil: true,
              },
            },
          },
        });
        return { dataMenunggu };
      });

      const data = result.dataMenunggu.map((item: any) => ({
        idPermintaan: item.id,
        idStokPotong: item.stokPotong.id,
        namaBarang: item.namaBarang,
        ukuran: item.ukuran,
        kodeKain: item.stokPotong.kodeKain,
        pemotong: item.stokPotong.pemotong.map((p: any) => p.user.nama),
        jumlahHasil: item.stokPotong.jumlahHasil,
        tanggalSelesaiPotong: item.tanggalMasuk,
      }));

      return res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching selesai data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async updateStatusMenunggu(req: Request, res: Response) {
    try {
      const { idStokPotong } = req.params;
      if (!idStokPotong) {
        return res
          .status(400)
          .json({ message: "ID stok potong tidak ditemukan" });
      }

      if (Array.isArray(idStokPotong)) {
        // Handle the case where idStokPotong is an array
        return res
          .status(400)
          .json({ message: "ID stok potong must be a single value" });
      }

      const updatedStokPotong = await prisma.stokPotong.update({
        where: { id: String(idStokPotong), status: StatusStokPotong.MENUNGGU },
        data: { status: "PROSES", tanggalCek: new Date() },
        select: {
          permintaan: {
            select: {
              id: true,
            },
          },
        },
      });

      console.log(updatedStokPotong);

      if (!updatedStokPotong) {
        return res.status(404).json({ message: "Stok potong tidak ditemukan" });
      }

      await TrackLog.logPermintaan(
        String(updatedStokPotong.permintaan.id),
        "Stok potong sedang diproses pengecekan oleh Divisi Stok Potong",
        StatusPermintaan.PROSES_STOK_POTONG,
      );

      await prisma.permintaan.update({
        where: { id: updatedStokPotong.permintaan.id },
        data: { status: StatusPermintaan.PROSES_STOK_POTONG },
      });

      return res.status(200).json({
        message: "Potong sedang diproses pengecekan oleh divisi Stok Potong",
        status: "PROSES_STOK_POTONG",
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message:
            "ID Permintaan tidak ditemukan atau statusnya bukan 'PROSES_POTONG'",
        });
      }
      console.error("Error updating stok potong:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async getDataProses(req: Request, res: Response) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Implementation for fetching selesai data
        const dataProses = await tx.permintaan.findMany({
          where: { status: "PROSES_STOK_POTONG" },
          select: {
            id: true,
            namaBarang: true,
            ukuran: true,
            tanggalMasuk: true,
            stokPotong: {
              select: {
                pemotong: {
                  select: {
                    user: {
                      select: {
                        nama: true,
                      },
                    },
                  },
                },
                id: true,
                kodeKain: true,
                jumlahHasil: true,
              },
            },
          },
        });
        return { dataProses };
      });

      const data = result.dataProses.map((item: any) => ({
        idPermintaan: item.id,
        idStokPotong: item.stokPotong.id,
        namaBarang: item.namaBarang,
        ukuran: item.ukuran,
        kodeKain: item.stokPotong.kodeKain,
        pemotong: item.stokPotong.pemotong.map((p: any) => p.user.nama),
        jumlahHasil: item.stokPotong.jumlahHasil,
        tanggalSelesaiPotong: item.tanggalMasuk,
      }));

      return res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching selesai data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async updateStatusProses(req: Request, res: Response) {
    const schema = z.object({
      params: z.object({
        idStokPotong: z
          .string()
          .uuid()
          .min(1, "ID Stok Potong harus berupa UUID yang valid"),
      }),
      body: z.object({
        idPengecek: z.preprocess(
          (val) => (Array.isArray(val) ? val : [val]), // Jika bukan array, bungkus jadi array
          z.array(z.string().uuid()),
        ),
        kodeStokPotongan: z
          .string()
          .min(1, "Kode stok potong tidak boleh kosong"),
        jumlahPotonganLolos: z.coerce.number().int().default(0),
        jumlahPotonganReject: z.coerce.number().int().default(0),
        catatan: z.string().optional(),
      }),
    });
    try {
      const validated = Validator(schema)(req, res);
      if (!validated) return;
      const { idStokPotong } = validated.params;
      const {
        idPengecek,
        kodeStokPotongan,
        jumlahPotonganLolos,
        jumlahPotonganReject,
        catatan,
      } = validated.body;

      const pengecekDetails = await prisma.user.findMany({
        where: { id: { in: idPengecek }, role: "STOK_POTONG" },
        select: { id: true, nama: true, noHandphone: true },
      });

      if (pengecekDetails.length !== idPengecek.length) {
        return res.status(404).json({
          message:
            "Salah satu atau lebih ID Pengecek tidak ditemukan di database",
        });
      }

      const updatedStokPotong = await prisma.stokPotong.update({
        where: { id: String(idStokPotong), status: StatusStokPotong.PROSES },
        data: {
          status: "SELESAI",
          tanggalSelesai: new Date(),
          kodeStokPotongan: kodeStokPotongan,
          jumlahLolos: jumlahPotonganLolos,
          jumlahReject: jumlahPotonganReject,
          pengecek: {
            create: idPengecek.map((id: string) => ({
              user: { connect: { id } },
            })),
          },
          permintaan: {
            update: {
              status: StatusPermintaan.MENUNGGU_KURIR,
            },
          },
          notes: catatan,
        },
        select: {
          permintaan: {
            select: {
              id: true,
            },
          },
          jumlahLolos: true,
          jumlahReject: true,
        },
      });

      const daftarNama = pengecekDetails
        .map((u) => `${u.nama} (${u.noHandphone})`)
        .join(", ");

      await TrackLog.logPermintaan(
        String(updatedStokPotong.permintaan.id),
        `Potongan selesai dicek oleh: ${daftarNama}. Lolos: ${updatedStokPotong.jumlahLolos} pcs, Reject: ${updatedStokPotong.jumlahReject} pcs.`,
        StatusPermintaan.MENUNGGU_KURIR,
      );
      await TrackLog.logPermintaan(
        String(updatedStokPotong.permintaan.id),
        `Potongan Masuk di dalam Data Stok Potongan.`,
        StatusPermintaan.MENUNGGU_KURIR,
      );

      return res.status(200).json({
        message: "Permintaan potongan berhasil diproses",
        status: "MENUNGGU_KURIR",
        // data: result.stokPotongData,
      });
    } catch (error: any) {
      // Sekarang P2025 hampir pasti berasal dari .update({ where: { id: idPermintaan } })
      if (error.code === "P2025") {
        return res.status(404).json({
          message:
            "ID Stok Potong tidak ditemukan atau sudah diproses sebelumnya",
        });
      }

      console.error("Error updating Stok Potong status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async getDataStok(req: Request, res: Response) {
    try {
      // const result = await prisma.$transaction(async (tx) => {
      //   // Implementation for fetching selesai data
      //   const dataProses = await tx.permintaan.findMany({
      //     where: { status: { in: ["PROSES_STOK_POTONG", "MENUNGGU_KURIR"] } },
      //     select: {
      //       id: true,
      //       namaBarang: true,
      //       ukuran: true,
      //       tanggalMasuk: true,
      //       stokPotong: {
      //         select: {
      //           status: true,
      //           kodeStokPotongan: true,
      //           jumlahLolos: true,
      //           tanggalSelesai: true,
      //           pemotong: {
      //             select: {
      //               user: {
      //                 select: {
      //                   nama: true,
      //                 },
      //               },
      //             },
      //           },
      //           id: true,
      //           jumlahHasil: true,
      //         },
      //       },
      //     },
      //   });
      //   return { dataProses };
      // });

      const dataPotong = await prisma.stokPotong.findMany({
        where: {
          status: { in: [StatusStokPotong.KIRIM, StatusStokPotong.SELESAI] },
        },
        select: {
          id: true,
          status: true,
          kodeStokPotongan: true,
          jumlahLolos: true,
          tanggalSelesai: true,
          permintaan: {
            select: {
              id: true,
              namaBarang: true,
              ukuran: true,
              tanggalMasuk: true,
            },
          },
        },
      });

      const data = dataPotong.map((item: any) => ({
        idPermintaan: item.permintaan.id,
        idStokPotong: item.id,
        namaBarang: item.permintaan.namaBarang,
        status: item.status,
        ukuran: item.permintaan.ukuran,
        kodeStokPotongan: item.kodeStokPotongan,
        jumlahLolos: item.jumlahLolos,
        tanggalMasukPotong: item.tanggalSelesai,
      }));

      return res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching selesai data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async updateStatusKirim(req: Request, res: Response) {
    const schema = z.object({
      params: z.object({ idStokPotong: z.string().uuid() }),
      body: z.object({ idPenjahit: z.string().uuid() }),
    });

    try {
      const validated = Validator(schema)(req, res);
      if (!validated) return;

      const { idStokPotong } = validated.params;
      const { idPenjahit } = validated.body;

      // 2. Validasi Penjahit (Pastikan Role JAHIT sesuai enum)
      const penjahit = await prisma.user.findUnique({
        where: { id: String(idPenjahit), role: "JAHIT" },
        select: { id: true },
      });

      if (!penjahit) {
        return res
          .status(404)
          .json({ message: "Penjahit tidak ditemukan atau role tidak sesuai" });
      }

      console.log(idStokPotong);

      // const stokPotong = await prisma.stokPotong.findUnique({
      //   where: { id: String(idStokPotong) },
      //   select: { status: true },
      // });

      // return res.status(200).json(stokPotong);

      // 3. Update StokPotong & Create ProsesStokPotong
      const updatedStokPotong = await prisma.stokPotong.update({
        where: { id: String(idStokPotong), status: StatusStokPotong.SELESAI },
        data: {
          status: StatusStokPotong.KIRIM,
          tanggalCek: new Date(), // Mengisi tanggal cek dengan "now"
          proses: {
            create: {
              penjahitId: penjahit.id,
              status: StatusProses.MENUNGGU_PENGIRIMAN, // Status awal proses berdasarkan Enum StatusProses
            },
          },
        },
        select: {
          permintaan: {
            select: {
              id: true,
            },
          },
        },
      });

      // 4. Logging & Response
      await TrackLog.logPermintaan(
        String(updatedStokPotong.permintaan.id),
        "Stok potong sedang menunggu diantar oleh kurir",
        "MENUNGGU_KURIR", // Pastikan StatusPermintaan.MENUNGGU_KURIR tersedia di enum
      );

      return res.status(200).json({
        message: "Potong sedang menunggu kurir untuk diambil",
        status: "MENUNGGU_KURIR",
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message: "ID Stok Potong tidak ditemukan",
          error,
        });
      }
      // Handle Unique Constraint (jika proses sudah ada)
      if (error.code === "P2002") {
        return res.status(400).json({
          message: "Stok potong ini sudah dalam proses pengiriman sebelumnya",
        });
      }
      console.error("Error updating Stok Potong status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async getListPengecek(req: Request, res: Response) {
    try {
      const pengecek = await prisma.user.findMany({
        where: { role: "STOK_POTONG" },
        select: {
          id: true,
          nama: true,
        },
      });
      return res.status(200).json(pengecek);
    } catch (error) {
      console.error("Error fetching pengecek data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async getListPenjahit(req: Request, res: Response) {
    try {
      const penjahit = await prisma.user.findMany({
        where: { role: "JAHIT" },
        select: {
          id: true,
          nama: true,
        },
      });
      return res.status(200).json(penjahit);
    } catch (error) {
      console.error("Error fetching penjahit data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
