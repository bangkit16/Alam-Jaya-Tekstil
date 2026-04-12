import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import TrackLog from "../lib/trackLog.js";
import {
  StatusPermintaan,
  StatusProses,
} from "../generated/prisma/enums.js";

export default class KurirController {
  public static async getDataMenunggu(req: Request, res: Response) {
    try {
      const dataMenunggu = await prisma.prosesStokPotong.findMany({
        where: {
          status: StatusProses.MENUNGGU_PENGIRIMAN,
        },
        select: {
          id: true,
          penjahit: {
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
                  jumlahMinta: true,
                  tanggalMasuk: true,
                },
              },
            },
          },
        },
      });
      const data = dataMenunggu.map((item) => ({
        idProsesStokPotong: item.id,
        namaBarang: item.stokPotong.permintaan.namaBarang,
        ukuran: item.stokPotong.permintaan.ukuran,
        namaPenjahit: item.penjahit?.nama,
        isUrgent: item.stokPotong.permintaan.isUrgent,
        kodeStokPotongan: item.stokPotong.kodeStokPotongan,
        jumlahLolos: item.stokPotong.jumlahLolos,
      }));
      return res.json(data);
    } catch (error) {
      console.error("Error fetching data menunggu:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async updateProsesMenunggu(req: Request, res: Response) {
    try {
      const { idProsesStokPotong } = req.params;
      const { idKurir } = req.body;

      if (!idProsesStokPotong || Array.isArray(idProsesStokPotong)) {
        return res.status(400).json({ message: "ID permintaan tidak valid" });
      }

      const errors: string[] = [];

      if (!idKurir || typeof idKurir !== "string") {
        errors.push("Kode kain tidak boleh kosong.");
      }

      if (errors.length > 0) {
        return res.status(400).json({
          message: "Validasi gagal",
          errors,
        });
      }

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
        },
      });

      TrackLog.logPermintaan(
        String(prosesStokPotong.stokPotong.permintaan.id),
        `Stok potongan sedang dikirimkan oleh kurir ${prosesStokPotong.kurir?.nama}, No HP: ${prosesStokPotong.kurir?.noHandphone} .`,
        StatusPermintaan.PROSES_KURIR,
      );
      TrackLog.logStatus(
        String(prosesStokPotong.stokPotong.permintaan.id),
        StatusPermintaan.PROSES_KURIR,
      );

      return res.json({
        message: "Stok potongan sedang dikirimkan",
        status: StatusPermintaan.PROSES_KURIR,
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

  public static async getDataProses(req: Request, res: Response) {
    try {
      [
        {
          id_proses_stok_potong: "bcvc3sad22e-fe64-4343-a275-5b2de4ad8615",
          namaBarang: "Hoodie Green Navy",
          ukuran: "L",
          namaPenjahit: "Sari",
          jumlahLolos: 20,
          kodeStokPotongan: "AD-0123-A1",
          tanggalBerangkat: "2023-10-27T10:00:00Z",
        },
      ];
      const dataProses = await prisma.prosesStokPotong.findMany({
        where: {
          status: StatusProses.PROSES_PENGIRIMAN,
        },
        select: {
          id: true,
          tanggalBerangkat: true,
          penjahit: {
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
      });
      const data = dataProses.map((item) => ({
        idProsesStokPotong: item.id,
        namaBarang: item.stokPotong.permintaan.namaBarang,
        ukuran: item.stokPotong.permintaan.ukuran,
        namaPenjahit: item.penjahit?.nama,
        isUrgent: item.stokPotong.permintaan.isUrgent,
        kodeStokPotongan: item.stokPotong.kodeStokPotongan,
        jumlahLolos: item.stokPotong.jumlahLolos,
        tanggalBerangkat: item.tanggalBerangkat,
      }));
      return res.json(data);
    } catch (error) {
      console.error("Error fetching data proses:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async updateProsesSelesai(req: Request, res: Response) {
    try {
      const { idProsesStokPotong } = req.params;

      if (!idProsesStokPotong) {
        return res
          .status(400)
          .json({ error: "ID proses stok potong tidak ditemukan" });
      }

      if (Array.isArray(idProsesStokPotong)) {
        // Handle the case where idProsesStokPotong is an array
        return res
          .status(400)
          .json({ error: "ID proses stok potong must be a single value" });
      }

      const prosesStokPotong = await prisma.prosesStokPotong.update({
        where: {
          id: idProsesStokPotong,
          status: StatusProses.PROSES_PENGIRIMAN,
        },
        data: {
          status: StatusProses.SELESAI_PENGIRIMAN,
          tanggalSampai: new Date(),
        },
        select: {
          penjahit: {
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
        `Stok potongan berhasil di kirim ke penjahit ${prosesStokPotong.penjahit?.nama}, No Handphone : (${prosesStokPotong.penjahit?.noHandphone}) .`,
        StatusPermintaan.MENUNGGU_JAHIT,
      );

      TrackLog.logStatus(
        String(prosesStokPotong.stokPotong.permintaan.id),
        StatusPermintaan.MENUNGGU_JAHIT,
      );

      return res.json({
        message: "Stok potongan berhasil di kirim",
        status: StatusPermintaan.MENUNGGU_JAHIT,
      });
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
      const dataSelesai = await prisma.prosesStokPotong.findMany({
        where: {
          status: StatusProses.SELESAI_PENGIRIMAN,
        },
        select: {
          id: true,
          tanggalSampai: true,
          tanggalBerangkat: true,
          kurir: {
            select: {
              nama: true,
            },
          },
          penjahit: {
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
      });
      const data = dataSelesai.map((item) => ({
        idProsesStokPotong: item.id,
        namaBarang: item.stokPotong.permintaan.namaBarang,
        ukuran: item.stokPotong.permintaan.ukuran,
        namaPenjahit: item.penjahit?.nama,
        namakurir: item.kurir?.nama,
        isUrgent: item.stokPotong.permintaan.isUrgent,
        kodeStokPotongan: item.stokPotong.kodeStokPotongan,
        jumlahLolos: item.stokPotong.jumlahLolos,
        tanggalBerangkat: item.tanggalBerangkat,
        tanggalSampai: item.tanggalSampai,
      }));
      return res.json(data);
    } catch (error) {
      console.error("Error fetching data selesai:", error);
      return res.status(500).json({ error: "Internal server error" });
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
