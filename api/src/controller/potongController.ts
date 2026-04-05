import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { UkuranProduk } from "../generated/prisma/enums";

export default class PermintaanProdukController {
  public static async getKategori(req: Request, res: Response) {
    try {
      const kategori = await prisma.kategoriProduk.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
        },
      });
      return res.json(kategori);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  public static async getPermintaanProduk(req: Request, res: Response) {
    try {
      const permintaanProduk = await prisma.permintaanProduk.findMany({
        // include: { user: true },
        where: { status: "MENUNGGU_PROSES" },
        select: {
          id: true,
          namaProduk: true,
          jumlah: true,
          ukuran: true,
          userId: true,
          isUrgent: true,
        },
      });

      const data = permintaanProduk.map((item) => ({
        id_permintaan: item.id, // Ganti nama di sini
        nama_produk: item.namaProduk,
        jumlah: item.jumlah,
        ukuran: item.ukuran,
        user_id: item.userId,
        is_urgent: item.isUrgent,
      }));
      return res.json(data);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async updatePermintaanProduk(req: Request, res: Response) {
    try {
      if (!req.body) {
        return res.status(400).json({ message: "Field tidak boleh kosong" });
      }

      const { id_permintaan } = req.params;
      const { kode_kain, pemotong, pengecek } = req.body;

      const errors: any = {};

      if (kode_kain == null) errors.kode_kain = "Kode kain wajib diisi";
      if (pemotong == null) errors.pemotong = "Nama pemotong wajib diisi";
      if (pengecek == null) errors.pengecek = "Nama pengecek wajib diisi";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          message: "Validasi gagal",
          errors: errors,
        });
      }

      if (!id_permintaan) {
        return res.status(400).json({ message: "id_permintaan is required" });
      }

      const permintaanProduk = await prisma.permintaanProduk.update({
        where: { id: String(id_permintaan) },
        data: {
          kodeKain: kode_kain,
          pemotong: pemotong,
          pengecek: pengecek,
          status: "PROSES",
        },
      });
      return res
        .status(200)
        .json({ message: "Data updated successfully", data: permintaanProduk });
    } catch (error: any) {
      console.error(error);
      if (error.code === "P2025") {
        return res.status(404).json({
          message: "Data produk tidak ditemukan atau ID salah",
        });
      }
      if (error instanceof Error && error.message.includes("no record")) {
        return res.status(404).json({ message: "Record not found" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async getPermintaanProses(req: Request, res: Response) {
    try {
      const permintaanProduk = await prisma.permintaanProduk.findMany({
        where: { status: "PROSES" },
        select: {
          id: true,
          namaProduk: true,
          kodeKain: true,
          jumlah: true,
          ukuran: true,
          userId: true,
          isUrgent: true,
          pengecek: true,
          pemotong: true,
        },
      });

      const data = permintaanProduk.map((item) => ({
        id_permintaan: item.id,
        nama_produk: item.namaProduk,
        kode_kain: item.kodeKain,
        jumlah: item.jumlah,
        ukuran: item.ukuran,
        user_id: item.userId,
        is_urgent: item.isUrgent,
        pengecek: item.pengecek,
        pemotong: item.pemotong,
      }));

      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async updatePermintaanProses(req: Request, res: Response) {
    try {
      if (!req.body) {
        return res.status(400).json({ message: "Field tidak boleh kosong" });
      }

      const { id_permintaan } = req.params;
      const { kode_potongan, jumlah_lolos, pengecek } = req.body;

      const errors: any = {};

      if (kode_potongan == null)
        errors.kode_potongan = "Kode potongan wajib diisi";
      if (jumlah_lolos == null)
        errors.jumlah_lolos = "Jumlah lolos wajib diisi";
      if (pengecek == null) errors.pengecek = "Nama pengecek wajib diisi";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          message: "Validasi gagal",
          errors: errors,
        });
      }

      if (!id_permintaan) {
        return res.status(400).json({ message: "id_permintaan is required" });
      }

      const permintaan = await prisma.permintaanProduk.findUnique({
        where: { id: String(id_permintaan) },
        select: {
          kodeKain: true,
          namaProduk: true,
          jumlah: true,
          ukuran: true,
        },
      });

      const data = await prisma.stokPotong.create({
        // where: { id: String(id_permintaan) },
        data: {
          kodePotong: kode_potongan,
          kodeKain: permintaan?.kodeKain,
          // ===========
          kategoriId: String("70dd7ab4-ccb4-423e-848f-0c454672ce88"), //Sementara kategori
          // ===========
          namaProduk: String(permintaan?.namaProduk),
          jumlah: jumlah_lolos,
          permintaanId: String(id_permintaan),
          pengecek: pengecek,
          ukuran: permintaan?.ukuran as UkuranProduk,
        },
      });

      const permintaanProduk = await prisma.permintaanProduk.update({
        where: { id: String(id_permintaan) },
        data: {
          status: "SELESAI",
        },
      });

      return res
        .status(200)
        .json({ message: "Data updated successfully", data: permintaanProduk });
    } catch (error: any) {
      console.log(error);

      if (error.code === "P2025") {
        return res.status(404).json({
          message: "Data produk tidak ditemukan atau ID salah",
        });
      }
      if (error instanceof Error && error.message.includes("no record")) {
        return res.status(404).json({ message: "Record not found" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async getStokPotong(req: Request, res: Response) {
    try {
      const { slug } = req.params;

      const id = await prisma.kategoriProduk.findUnique({
        where: { slug: String(slug) },
        select: { id: true },
      });

      if (!id) {
        return res
          .status(404)
          .json({ message: "Kategori produk tidak ditemukan" });
      }

      const stokPotong = await prisma.stokPotong.findMany({
        where: { kategoriId: id?.id, status: "MASUK" },
        include: {
          permintaan: {
            select: {
              id: true,
              namaProduk: true,
              jumlah: true,
              status: true,
            },
          },
        },
      });

      const data = stokPotong.map((item) => ({
        id_stok_potong: item.id,
        id_permintaan: item.permintaan.id,
        nama_produk: item.namaProduk,
        kode_kain: item.kodeKain,
        kode_potongan: item.kodePotong,
        pengecek: item.pengecek,
        jumlah_hasil: item.jumlah,
        ukuran: item.ukuran,
      }));

      return res.json(data);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  public static async putStokPotong(req: Request, res: Response) {
    try {
      if (!req.body) {
        return res.status(400).json({ message: "Field tidak boleh kosong" });
      }

      const { id_stok_potong } = req.params;
      const { penjahit, admin, tanggal_kirim } = req.body;

      const errors: any = {};

      if (penjahit == null) errors.penjahit = "Nama Penjahit wajib diisi";
      if (admin == null) errors.admin = "Admin wajib diisi";
      if (tanggal_kirim == null)
        errors.tanggal_kirim = "Tanggal Kirim wajib diisi";

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      if (!id_stok_potong) {
        return res.status(400).json({ message: "id_stok_potong is required" });
      }

      const stokPotong = await prisma.stokPotong.findUnique({
        where: { id: String(id_stok_potong) },
      });

      if (!stokPotong) {
        return res.status(404).json({ message: "Stok potong tidak ditemukan" });
      }

      const updatedStokPotong = await prisma.stokPotong.update({
        where: { id: String(id_stok_potong) },
        data: {
          penjahit: penjahit,
          admin: admin,
          tanggalKirim: new Date(tanggal_kirim),
          status: "KIRIM",
        },
      });

      return res.json(updatedStokPotong);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async getStokKirim(req: Request, res: Response) {
    try {
      const stokPotong = await prisma.stokPotong.findMany({
        where: { status: "KIRIM" },
        include: {
          kategori: true,
          permintaan: {
            select: {
              id: true,
              namaProduk: true,
              jumlah: true,
              status: true,
              isUrgent: true,
            },
          },
        },
      });

      const data = stokPotong.map((item) => ({
        id_stok_potong: item.id,
        id_permintaan: item.permintaan.id,
        ukuran: item.ukuran,
        is_urgent: item.permintaan.isUrgent,
        nama_produk: item.namaProduk,
        jumlah_lolos: item.jumlah,
        jumlah_permintaan: item.permintaan.jumlah,
        kode_potongan: item.kodePotong,
        kode_kain: item.kodeKain,
        pengecek: item.pengecek,
        penjahit: item.penjahit,
        admin: item.admin,
        tanggal_kirim: item.tanggalKirim,
      }));

      return res.json(data);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
