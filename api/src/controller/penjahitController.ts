import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import TrackLog from "../lib/trackLog.js";
import {
  StatusPermintaan,
  StatusProses,
  StatusQC,
  StatusStokPotong,
} from "../generated/prisma/enums.js";
import z from "zod";
import { Validator } from "../lib/validator.js";
import { stat } from "node:fs";



export default class PenjahitController {
  public static async getDataMenunggu(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const dataMenunggu = await prisma.prosesStokPotong.findMany({
        where: {
          status: StatusProses.SELESAI_PENGIRIMAN,
          penjahitId: userId,
        },
        select: {
          id: true,
          tanggalSampai: true,
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
      const data = dataMenunggu.map((item) => ({
        idProsesStokPotong: item.id,
        kodeStokPotongan: item.stokPotong.kodeStokPotongan,
        namaBarang: item.stokPotong.permintaan.namaBarang,
        ukuran: item.stokPotong.permintaan.ukuran,
        jumlah: item.stokPotong.jumlahLolos,
        isUrgent: item.stokPotong.permintaan.isUrgent,
        tanggalKirim: item.tanggalSampai,
      }));
      return res.json(data);
    } catch (error) {
      console.error("Error fetching data selesai:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async updateMenungguProses(req: Request, res: Response) {
    const schema = z.object({
      params: z.object({ idProsesStokPotong: z.string().uuid() }),
    });

    try {
      const validated = Validator(schema)(req, res);
      if (!validated) return;
      const { idProsesStokPotong } = validated.params;
      const userId = req.user?.id;
      const updateMulai = await prisma.prosesStokPotong.update({
        where: {
          id: idProsesStokPotong,
          status: StatusProses.SELESAI_PENGIRIMAN,
          penjahitId: userId,
        },
        data: {
          status: StatusProses.DIKERJAKAN,
          tanggalMulaiJahit: new Date(),
          stokPotong: {
            update: {
              permintaan: {
                update: {
                  status: StatusPermintaan.PROSES_JAHIT,
                }
              }
            },
          }
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
        String(updateMulai.stokPotong.permintaan.id),
        `Stok potongan telah diambil dan mulai dijahit oleh penjahit ${updateMulai.penjahit?.nama}, No Handphone : (${updateMulai.penjahit?.noHandphone}). `,
        StatusPermintaan.PROSES_JAHIT,
      );
      // TrackLog.logStatus(
      //   String(updateMulai.stokPotong.permintaan.id),
      //   StatusPermintaan.PROSES_JAHIT,
      // );
      return res.status(200).json({
        message: "Pekerjaan dimulai",
        status: "PROSES_JAHIT",
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

  public static async getDataProses(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const dataProses = await prisma.prosesStokPotong.findMany({
        where: {
          status: {
            in: [StatusProses.DIKERJAKAN, StatusProses.JEDA],
          },
          penjahitId: userId,
        },
        select: {
          id: true,
          tanggalMulaiJahit: true,
          status: true,
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
      const data = dataProses.map((item) => ({
        idProsesStokPotong: item.id,
        namaBarang: item.stokPotong.permintaan.namaBarang,
        ukuran: item.stokPotong.permintaan.ukuran,
        jumlahLolos: item.stokPotong.jumlahLolos,
        kodeStokPotongan: item.stokPotong.kodeStokPotongan,
        tanggalMulaiJahit: item.tanggalMulaiJahit,
        isUrgent: item.stokPotong.permintaan.isUrgent,
        status: item.status,
      }));
      return res.json(data);
    } catch (error) {
      console.error("Error fetching data selesai:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async updateProsesDikerjakan(req: Request, res: Response) {
    const schema = z.object({
      params: z.object({ idProsesStokPotong: z.string().uuid() }),
    });

    try {
      const validated = Validator(schema)(req, res);
      if (!validated) return;
      const { idProsesStokPotong } = validated.params;
      const userId = req.user?.id;
      const updateMulai = await prisma.prosesStokPotong.update({
        where: {
          id: idProsesStokPotong,
          status: StatusProses.JEDA,
          penjahitId: userId,
        },
        data: {
          status: StatusProses.DIKERJAKAN,
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
        String(updateMulai.stokPotong.permintaan.id),
        `Proses jahitan sedang dilanjutkan oleh penjahit ${updateMulai.penjahit?.nama}, No Handphone : (${updateMulai.penjahit?.noHandphone}). `,
        StatusPermintaan.PROSES_JAHIT,
      );
      return res.status(200).json({
        message: "Potongan sedang dijahit",
        statusJahit: "DIKERJAKAN",
        status: "PROSES_JAHIT",
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

  public static async updateProsesJeda(req: Request, res: Response) {
    const schema = z.object({
      params: z.object({ idProsesStokPotong: z.string().uuid() }),
    });

    try {
      const validated = Validator(schema)(req, res);
      if (!validated) return;
      const { idProsesStokPotong } = validated.params;
      const userId = req.user?.id;
      const updateJeda = await prisma.prosesStokPotong.update({
        where: {
          id: idProsesStokPotong,
          status: StatusProses.DIKERJAKAN,
          penjahitId: userId,
        },
        data: {
          status: StatusProses.JEDA,
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
        String(updateJeda.stokPotong.permintaan.id),
        `Proses jahitan sedang dijeda oleh penjahit ${updateJeda.penjahit?.nama}, No Handphone : (${updateJeda.penjahit?.noHandphone}). `,
        StatusPermintaan.JEDA_JAHIT,
      );
      return res.status(200).json({
        message: "Potongan sedang dijeda",
        statusJahit: "JEDA",
        status: "JEDA_JAHIT",
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

  public static async updateProsesSelesai(req: Request, res: Response) {
    const schema = z.object({
      params: z.object({ idProsesStokPotong: z.string().uuid() }),
      body: z.object({
        jumlahSelesaiJahit: z.number().min(0),
        catatan: z.string().optional(),
      }),
    });

    try {
      const validated = Validator(schema)(req, res);
      if (!validated) return;
      const { idProsesStokPotong } = validated.params;
      const userId = req.user?.id;
      const updateSelesai = await prisma.prosesStokPotong.update({
        where: {
          id: idProsesStokPotong,
          status: StatusProses.DIKERJAKAN,
          penjahitId: userId,
        },
        data: {
          status: StatusProses.SELESAI_JAHIT,
          tanggalSelesaiJahit: new Date(),
          jumlahSelesai: validated.body.jumlahSelesaiJahit,
          notes: validated.body.catatan,
          stokPotong: {
            update: {
              permintaan: {
                update: {
                  status: StatusPermintaan.MENUNGGU_QC,
                }
              }
            }
          }
        },
        select: {
          jumlahSelesai: true,
          penjahit: {
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
          stokPotongId: updateSelesai.stokPotong.id,
          status: StatusQC.MENUNGGU,
        },
      });
      TrackLog.logPermintaan(
        String(updateSelesai.stokPotong.permintaan.id),
        `Proses jahitan selesai oleh penjahit ${updateSelesai.penjahit?.nama}, No Handphone : (${updateSelesai.penjahit?.noHandphone}). Menunggu proses QC. `,
        StatusPermintaan.MENUNGGU_QC,
      );
      TrackLog.logPermintaan(
        String(updateSelesai.stokPotong.permintaan.id),
        `Hasil jahitan menunggu proses QC.`,
        StatusPermintaan.MENUNGGU_QC,
      );

      return res.status(200).json({
        message: "Data jahit berhasil diselesaikan",
        status: "MENUNGGU_QC",
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
      const userId = req.user?.id;
      const dataMenunggu = await prisma.prosesStokPotong.findMany({
        where: {
          status: StatusProses.SELESAI_JAHIT,
          penjahitId: userId,
        },
        select: {
          id: true,
          tanggalSampai: true,
          tanggalSelesaiJahit: true,
          jumlahSelesai: true,
          notes: true,
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
      const data = dataMenunggu.map((item) => ({
        idProsesStokPotong: item.id,
        namaBarang: item.stokPotong.permintaan.namaBarang,
        kodeStokPotongan: item.stokPotong.kodeStokPotongan,
        ukuran: item.stokPotong.permintaan.ukuran,
        jumlahSelesai: item.jumlahSelesai,
        isUrgent: item.stokPotong.permintaan.isUrgent,
        tanggalSelesai: item.tanggalSelesaiJahit,
        catatan: item.notes,
      }));
      return res.json(data);
    } catch (error) {
      console.error("Error fetching data selesai:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
