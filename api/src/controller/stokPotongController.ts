import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
// import { UkuranProduk } from "../generated/prisma/enums";
export default class StokPotongController {
  // public static async getKategori(req: Request, res: Response) {
  //   try {
  //     const kategori = await prisma.kategoriProduk.findMany({
  //       select: {
  //         id: true,
  //         name: true,
  //         slug: true,
  //       },
  //     });
  //     return res.json(kategori);
  //   } catch (error) {
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // }

  // public static async getStokPotong(req: Request, res: Response) {
  //   try {
  //     const { slug } = req.params;

  //     const id = await prisma.kategoriProduk.findUnique({
  //       where: { slug: String(slug) },
  //       select: { id: true },
  //     });

  //     if (!id) {
  //       return res
  //         .status(404)
  //         .json({ message: "Kategori produk tidak ditemukan" });
  //     }

  //     const stokPotong = await prisma.stokPotong.findMany({
  //       where: { kategoriId: id?.id, status: "MASUK" },
  //       include: {
  //         permintaan: {
  //           select: {
  //             id: true,
  //             namaProduk: true,
  //             jumlah: true,
  //             status: true,
  //           },
  //         },
  //       },
  //     });

  //     const data = stokPotong.map((item: any) => ({
  //       id_stok_potong: item.id,
  //       id_permintaan: item.permintaan.id,
  //       nama_produk: item.namaProduk,
  //       kode_kain: item.kodeKain,
  //       kode_potongan: item.kodePotong,
  //       pengecek: item.pengecek,
  //       jumlah_hasil: item.jumlah,
  //       jumlah_permintaan: item.permintaan.jumlah,
  //       ukuran: item.ukuran,
  //     }));

  //     return res.json(data);
  //   } catch (error) {
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // }
  // public static async putStokPotong(req: Request, res: Response) {
  //   try {
  //     if (!req.body) {
  //       return res.status(400).json({ message: "Field tidak boleh kosong" });
  //     }

  //     // Nama petugas pengecek
  //     // Kode stok potongan
  //     // Jumlah potongan yang diterima
  //     // Jumlah potongan yang lolos pengecekan
  //     // Jumlah potongan reject / tidak sesuai (jika ada)
  //     // Catatan pengecekan (opsional)

  //     const { id_stok_potong } = req.params;
  //     const { pengecek, notes, jumlah_diterima, jumlah_lolos, jumlah_reject } =
  //       req.body;

  //     const errors: any = {};

  //     if (!pengecek) errors.pengecek = "Nama Pengecek wajib diisi";
  //     if (!jumlah_diterima)
  //       errors.jumlah_diterima = "Jumlah diterima wajib diisi";
  //     if (!jumlah_lolos) errors.jumlah_lolos = "Jumlah lolos wajib diisi";

  //     if (Object.keys(errors).length > 0) {
  //       return res.status(400).json({ errors });
  //     }

  //     if (!id_stok_potong) {
  //       return res.status(400).json({ message: "id_stok_potong is required" });
  //     }

  //     const stokPotong = await prisma.stokPotong.findUnique({
  //       where: { id: String(id_stok_potong) },
  //     });

  //     if (!stokPotong) {
  //       return res.status(404).json({ message: "Stok potong tidak ditemukan" });
  //     }

  //     const updatedStokPotong = await prisma.stokPotong.update({
  //       where: { id: String(id_stok_potong) },
  //       data: {
  //         pengecek,
  //         notes,
  //         jumlah_diterima,
  //         jumlah_lolos,
  //         jumlah_reject,
  //         status: "PROSESPENGECEKAN",
  //       },
  //     });

  //     return res.json(updatedStokPotong);
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // }

  // public static async getStokProsesPengecekan(req: Request, res: Response) {
  //   try {
  //     const stokPotong = await prisma.stokPotong.findMany({
  //       where: { status: "PROSESPENGECEKAN" },
  //       include: {
  //         kategori: true,
  //         permintaan: {
  //           select: {
  //             id: true,
  //             namaProduk: true,
  //             jumlah: true,
  //             status: true,
  //             isUrgent: true,
  //           },
  //         },
  //       },
  //     });

  //     const data = stokPotong.map((item: any) => ({
  //       id_stok_potong: item.id,
  //       id_permintaan: item.permintaan.id,
  //       ukuran: item.ukuran,
  //       is_urgent: item.permintaan.isUrgent,
  //       nama_produk: item.namaProduk,
  //       jumlah_lolos: item.jumlah,
  //       jumlah_permintaan: item.permintaan.jumlah,
  //       kode_potongan: item.kodePotong,
  //       kode_kain: item.kodeKain,
  //       pengecek: item.pengecek,
  //       penjahit: item.penjahit,
  //       admin: item.admin,
  //       tanggal_kirim: item.tanggalKirim,
  //       tanggal_selesai: item.tanggalSelesai,
  //       status: item.status,
  //     }));

  //     return res.json(data);
  //   } catch (error) {
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // }
}
