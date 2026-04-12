import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import TrackLog from "../lib/trackLog.js";
import {
  StatusPermintaan,
  StatusProses,
  StatusQC,
} from "../generated/prisma/enums.js";
import { Validator } from "../lib/validator.js";
import z from "zod";

export default class QCController {
  public static async getDataMenunggu(req: Request, res: Response) {
    try {
      const dataMenunggu = await prisma.qCStokPotong.findMany({
        where: {
          status: StatusQC.MENUNGGU,
        },
        select: {
          id: true,
          notes: true,
          stokPotong: {
            select: {
              proses: {
                select: {
                  jumlahSelesai: true,
                  tanggalSelesaiJahit: true,
                  penjahit: {
                    select: {
                      nama: true,
                    },
                  },
                },
              },
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
      const data = dataMenunggu.map((item) => ({
        idQC: item.id,
        namaBarang: item.stokPotong.permintaan.namaBarang,
        ukuran: item.stokPotong.permintaan.ukuran,
        namaPenjahit: item.stokPotong?.proses?.penjahit?.nama,
        kodeStokPotongan: item.stokPotong.kodeStokPotongan,
        jumlahSelesaiJahit: item.stokPotong.proses?.jumlahSelesai,
        tanggalSelesaiJahit: item.stokPotong.proses?.tanggalSelesaiJahit,
        isUrgent: item.stokPotong.permintaan.isUrgent,
      }));
      return res.json(data);
    } catch (error) {
      console.error("Error fetching data selesai:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async updateProsesDikerjakan(req: Request, res: Response) {
    const schema = z.object({
      params: z.object({ idQC: z.string().uuid() }),
    });

    try {
      const validated = Validator(schema)(req, res);
      if (!validated) return;
      const { idQC } = validated.params;
      const updateProses = await prisma.qCStokPotong.update({
        where: {
          id: idQC,
          status: StatusQC.MENUNGGU,
        },
        data: {
          status: StatusQC.PROSES,
        },
        select: {
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
        String(updateProses.stokPotong.permintaan.id),
        "Hasil jahitan sedang di proses QC",
        StatusPermintaan.PROSES_QC,
      );
      return res.status(200).json({
        message: "Hasil jahitan sedang di proses QC",
        status: "PROSES_QC",
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
}
