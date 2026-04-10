import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import TrackLog from "../lib/trackLog";
import { StatusPermintaan } from "../generated/prisma/enums";
import { Prisma } from "../generated/prisma/browser";

export default class StokGudangController {
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
}
