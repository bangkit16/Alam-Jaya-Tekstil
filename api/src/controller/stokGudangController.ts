import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import TrackLog from "../lib/trackLog.js";
import {
  StatusBox,
  StatusPermintaan,
  StatusQC,
} from "../generated/prisma/enums.js";
import z from "zod";
import { Validator } from "../lib/validator.js";

export default class StokGudangController {
  public static async getBoxMasuk(req: Request, res: Response) {
    try {
      const data = await prisma.box.findMany({
        where: { status: StatusBox.MENUNGGU },
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
      });
      const mappedData = data.map((item) => ({
        idBox: item.id,
        namaBox: item.namaBox, // Atau item.qc[0]?.stokPotong.permintaan.namaBarang jika ingin nama barang
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
      return res.status(200).json(mappedData);
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
      const data = await prisma.box.findMany({
        where: { status: { in : [StatusBox.ACC , StatusBox.KIRIM]} },
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
      });
      const mappedData = data.map((item) => ({
        idBox: item.id,
        namaBox: item.namaBox, // Atau item.qc[0]?.stokPotong.permintaan.namaBarang jika ingin nama barang
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
      return res.status(200).json(mappedData);
    } catch (error) {
      console.error("Error fetching data selesai:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async getDataPermintaan(req: Request, res: Response) {
    try {
      const permintaan = await prisma.permintaan.findMany({
        where: { status: "MENUNGGU_GUDANG" },
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
      const data = permintaan.map((item: any) => ({
        idPermintaan: item.id,
        namaBarang: item.namaBarang,
        kategori: item.kategori.namaKategori,
        jenisPermintaan: item.jenisPermintaan,
        ukuran: item.ukuran,
        isUrgent: item.isUrgent,
        jumlahMinta: item.jumlahMinta,
        tanggalMasukPermintaan: item.tanggalMasuk,
      }));
      return res.status(200).json(data);
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

      const updatedPermintaan = await prisma.permintaan.update({
        where: { id: String(idPermintaan), status: "MENUNGGU_GUDANG" },
        data: { status: StatusPermintaan.MENUNGGU_POTONG },
      });

      if (!updatedPermintaan) {
        return res.status(404).json({ message: "Permintaan tidak ditemukan" });
      }

      await TrackLog.logPermintaan(
        idPermintaan,
        "Permintaan dikirim ke potong",
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
      const permintaan = await prisma.permintaan.findMany({
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

        return `[${formattedDate}] ${log.keterangan} - Status: ${log.status}`;
      });
      const data = permintaan.map((item: any) => ({
        idPermintaan: item.id,
        namaBarang: item.namaBarang,
        kategori: item.kategori.namaKategori,
        jenisPermintaan: item.jenisPermintaan,
        ukuran: item.ukuran,
        isUrgent: item.isUrgent,
        jumlahMinta: item.jumlahMinta,
        tanggalMasukPermintaan: item.tanggalMasuk,
        logPermintaan: dataLog,
      }));

      return res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching permintaan data:", error);
      return res.status(500).json({ message: "Internal server error" });
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
}
