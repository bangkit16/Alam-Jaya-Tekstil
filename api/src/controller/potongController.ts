import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
// import { UkuranProduk } from "../generated/prisma/enums";

export default class PermintaanProdukController {
  
  // public static async getPermintaanProduk(req: Request, res: Response) {
  //   try {
  //     const permintaanProduk = await prisma.permintaanProduk.findMany({
  //       // include: { user: true },
  //       where: { status: "MENUNGGU_PROSES" },
  //       select: {
  //         id: true,
  //         namaProduk: true,
  //         jumlah: true,
  //         ukuran: true,
  //         userId: true,
  //         isUrgent: true,
  //       },
  //     });

  //     const data = permintaanProduk.map((item: any) => ({
  //       id_permintaan: item.id, // Ganti nama di sini
  //       nama_produk: item.namaProduk,
  //       jumlah: item.jumlah,
  //       ukuran: item.ukuran,
  //       user_id: item.userId,
  //       is_urgent: item.isUrgent,
  //     }));
  //     return res.json(data);
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // }

  // public static async updatePermintaanProduk(req: Request, res: Response) {
  //   try {
  //     if (!req.body) {
  //       return res.status(400).json({ message: "Field tidak boleh kosong" });
  //     }

  //     const { id_permintaan } = req.params;
  //     const { kode_kain, pemotong, pengecek } = req.body;

  //     const errors: any = {};

  //     if (kode_kain == null && kode_kain.length == 0)
  //       errors.kode_kain = "Kode kain wajib diisi";
  //     if (pemotong == null && pemotong.length == 0)
  //       errors.pemotong = "Nama pemotong wajib diisi";
  //     if (pengecek == null && pengecek.length == 0)
  //       errors.pengecek = "Nama pengecek wajib diisi";

  //     if (Object.keys(errors).length > 0) {
  //       return res.status(400).json({
  //         message: "Validasi gagal",
  //         errors: errors,
  //       });
  //     }

  //     if (!id_permintaan) {
  //       return res.status(400).json({ message: "id_permintaan is required" });
  //     }

  //     const permintaanProduk = await prisma.permintaanProduk.update({
  //       where: { id: String(id_permintaan) },
  //       data: {
  //         kodeKain: kode_kain,
  //         pemotong: pemotong,
  //         pengecek: pengecek,
  //         status: "PROSES",
  //       },
  //     });
  //     return res
  //       .status(200)
  //       .json({ message: "Data updated successfully", data: permintaanProduk });
  //   } catch (error: any) {
  //     console.error(error);
  //     if (error.code === "P2025") {
  //       return res.status(404).json({
  //         message: "Data produk tidak ditemukan atau ID salah",
  //       });
  //     }
  //     if (error instanceof Error && error.message.includes("no record")) {
  //       return res.status(404).json({ message: "Record not found" });
  //     }
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // }

  // public static async getPermintaanProses(req: Request, res: Response) {
  //   try {
  //     const permintaanProduk = await prisma.permintaanProduk.findMany({
  //       where: { status: "PROSES" },
  //       select: {
  //         id: true,
  //         namaProduk: true,
  //         kodeKain: true,
  //         jumlah: true,
  //         ukuran: true,
  //         userId: true,
  //         isUrgent: true,
  //         pengecek: true,
  //         pemotong: true,
  //       },
  //     });

  //     const data = permintaanProduk.map((item: any) => ({
  //       id_permintaan: item.id,
  //       nama_produk: item.namaProduk,
  //       kode_kain: item.kodeKain,
  //       jumlah: item.jumlah,
  //       ukuran: item.ukuran,
  //       user_id: item.userId,
  //       is_urgent: item.isUrgent,
  //       pengecek: item.pengecek,
  //       pemotong: item.pemotong,
  //     }));

  //     return res.json(data);
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // }

  // public static async updatePermintaanProses(req: Request, res: Response) {
  //   try {
  //     if (!req.body) {
  //       return res.status(400).json({ message: "Field tidak boleh kosong" });
  //     }

  //     const { id_permintaan } = req.params;
  //     const { kode_potongan, jumlah_lolos, pengecek } = req.body;

  //     const errors: any = {};

  //     if (kode_potongan == null)
  //       errors.kode_potongan = "Kode potongan wajib diisi";
  //     if (jumlah_lolos == null)
  //       errors.jumlah_lolos = "Jumlah lolos wajib diisi";
  //     if (pengecek == null) errors.pengecek = "Nama pengecek wajib diisi";

  //     if (Object.keys(errors).length > 0) {
  //       return res.status(400).json({
  //         message: "Validasi gagal",
  //         errors: errors,
  //       });
  //     }

  //     if (!id_permintaan) {
  //       return res.status(400).json({ message: "id_permintaan is required" });
  //     }

  //     const permintaan = await prisma.permintaanProduk.update({
  //       where: { id: String(id_permintaan) },
  //       data: {
  //         status: "SELESAI",
  //       },
  //       select: {
  //         kodeKain: true,
  //         namaProduk: true,
  //         jumlah: true,
  //         ukuran: true,
  //         status: true, // Optional: if you want to confirm the new status
  //       },
  //     });

  //     // SEMENTARA
  //     const idKategori = await prisma.kategoriProduk.findFirst();

  //     const data = await prisma.stokPotong.create({
  //       // where: { id: String(id_permintaan) },
  //       data: {
  //         kodePotong: kode_potongan,
  //         kodeKain: permintaan?.kodeKain,
  //         // ===========
  //         kategoriId: String(idKategori?.id), //Sementara kategori
  //         // ===========
  //         namaProduk: String(permintaan?.namaProduk),
  //         jumlah: jumlah_lolos,
  //         permintaanId: String(id_permintaan),
  //         pengecek: pengecek,
  //         ukuran: permintaan?.ukuran as UkuranProduk,
  //       },
  //     });

  //     return res
  //       .status(200)
  //       .json({ message: "Data updated successfully", data: permintaan });
  //   } catch (error: any) {
  //     console.log(error);

  //     if (error.code === "P2025") {
  //       return res.status(404).json({
  //         message: "Data produk tidak ditemukan atau ID salah",
  //       });
  //     }
  //     if (error instanceof Error && error.message.includes("no record")) {
  //       return res.status(404).json({ message: "Record not found" });
  //     }
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // }

  // public static async getPermintaanSelesai(req: Request, res: Response) {
  //   try {
  //     const permintaanProduk = await prisma.permintaanProduk.findMany({
  //       where: { status: "SELESAI" },
  //       select: {
  //         id: true,
  //         namaProduk: true,
  //         kodeKain: true,
  //         jumlah: true,
  //         ukuran: true,
  //         userId: true,
  //         isUrgent: true,
  //         pengecek: true,
  //         pemotong: true,
  //       },
  //     });

  //     const data = permintaanProduk.map((item: any) => ({
  //       id_permintaan: item.id,
  //       nama_produk: item.namaProduk,
  //       kode_kain: item.kodeKain,
  //       jumlah: item.jumlah,
  //       ukuran: item.ukuran,
  //       user_id: item.userId,
  //       is_urgent: item.isUrgent,
  //       pengecek: item.pengecek,
  //       pemotong: item.pemotong,
  //     }));

  //     return res.json(data);
  //   } catch (error) {
  //     console.log(error);
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // }

  // =========================================

  
}
