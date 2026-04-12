import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import TrackLog from '../lib/trackLog.js';
import { StatusPermintaan, StatusStokPotong } from '../generated/prisma/enums.js';
// import { UkuranProduk } from "../generated/prisma/enums";

export default class PotongController {
  public static async getDataMenunggu(req: Request, res: Response) {
    try {
      const permintaan = await prisma.permintaan.findMany({
        where: { status: 'MENUNGGU_POTONG' },
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
      console.error('Error fetching permintaan data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  public static async updateStatusMenunggu(req: Request, res: Response) {
    try {
      const { idPermintaan } = req.params;
      if (!idPermintaan) {
        return res.status(400).json({ message: 'ID permintaan tidak ditemukan' });
      }

      if (Array.isArray(idPermintaan)) {
        // Handle the case where idPermintaan is an array
        return res.status(400).json({ message: 'ID permintaan must be a single value' });
      }

      const updatedPermintaan = await prisma.permintaan.update({
        where: { id: String(idPermintaan), status: 'MENUNGGU_POTONG' },
        data: { status: 'PROSES_POTONG' },
      });

      if (!updatedPermintaan) {
        return res.status(404).json({ message: 'Permintaan tidak ditemukan' });
      }

      await TrackLog.logPermintaan(String(idPermintaan), 'Permintaan Potong sedang diproses oleh Divisi Potong', StatusPermintaan.PROSES_POTONG);
      return res.status(200).json({
        message: 'Permintaan potong sedang diproses oleh Divisi Potong',
        status: StatusPermintaan.PROSES_POTONG,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Permintaan tidak ditemukan atau sudah diproses' });
      }
      console.error('Error updating permintaan status:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  public static async getDataProses(req: Request, res: Response) {
    try {
      const permintaan = await prisma.permintaan.findMany({
        where: { status: 'PROSES_POTONG' },
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
      console.error('Error fetching permintaan data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  public static async updateStatusProses(req: Request, res: Response) {
    try {
      const { idPermintaan } = req.params;
      const { kodeKain, idPemotong, jumlahHasil } = req.body;

      // 1. Validasi Input Dasar
      if (!idPermintaan || Array.isArray(idPermintaan)) {
        return res.status(400).json({ message: 'ID permintaan tidak valid' });
      }

      const errors = [];
      if (!kodeKain) errors.push('Kode kain tidak boleh kosong.');
      if (!Array.isArray(idPemotong) || idPemotong.length === 0) errors.push('Daftar pemotong tidak valid.');
      if (!jumlahHasil || jumlahHasil <= 0) errors.push('Jumlah hasil harus lebih dari 0.');

      if (errors.length > 0) {
        return res.status(400).json({ message: 'Validasi gagal', errors });
      }

      // 2. CEK PEMOTONG DAHULU (Pencegahan error P2025 yang salah alamat)
      const pemotongDetails = await prisma.user.findMany({
        where: { id: { in: idPemotong }, role: 'POTONG' },
        select: { id: true, nama: true, noHandphone: true },
      });

      if (pemotongDetails.length !== idPemotong.length) {
        return res.status(404).json({
          message: 'Salah satu atau lebih ID Pemotong tidak ditemukan di database',
        });
      }

      // 3. Jalankan Transaksi
      const result = await prisma.$transaction(async (tx) => {
        // Update Permintaan (Ini akan melempar P2025 jika ID salah atau status bukan PROSES_POTONG)
        const updatedPermintaan = await tx.permintaan.update({
          where: {
            id: String(idPermintaan),
            status: 'PROSES_POTONG',
          },
          data: { status: StatusPermintaan.MENUNGGU_STOK_POTONG },
        });

        const stokPotongData = await tx.stokPotong.create({
          data: {
            permintaanId: String(idPermintaan),
            kodeKain,
            jumlahHasil: jumlahHasil,
            status: StatusStokPotong.MENUNGGU,
            pemotong: {
              create: idPemotong.map((id: string) => ({
                user: { connect: { id } },
              })),
            },
          },
        });

        const daftarNama = pemotongDetails.map((u) => `${u.nama} (${u.noHandphone})`).join(', ');

        await TrackLog.logPermintaan(
          String(idPermintaan),
          `Pekerjaan potong selesai oleh: ${daftarNama}. Hasil: ${jumlahHasil} pcs.`,
          StatusPermintaan.MENUNGGU_STOK_POTONG
        );
        await TrackLog.logPermintaan(
          String(idPermintaan),
          `Menunggu pengecekan hasil potong di Divisi Stok Potong.`,
          StatusPermintaan.MENUNGGU_STOK_POTONG
        );

        return { updatedPermintaan, stokPotongData };
      });

      return res.status(200).json({
        message: 'Permintaan potongan berhasil diproses',
        status: 'MENUNGGU_STOK_POTONG',
        data: result.stokPotongData,
      });
    } catch (error: any) {
      // Sekarang P2025 hampir pasti berasal dari .update({ where: { id: idPermintaan } })
      if (error.code === 'P2025') {
        return res.status(404).json({
          message: 'ID Permintaan tidak ditemukan atau sudah diproses sebelumnya',
        });
      }

      console.error('Error updating permintaan status:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  public static async getDataSelesai(req: Request, res: Response) {
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Implementation for fetching selesai data
        const selesaiData = await tx.permintaan.findMany({
          where: { status: 'MENUNGGU_STOK_POTONG' },
          select: {
            id: true,
            namaBarang: true,
            ukuran: true,
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
                kodeKain: true,
                jumlahHasil: true,
              },
            },
            jumlahMinta: true,
          },
        });
        return { selesaiData };
      });

      const data = result.selesaiData.map((item: any) => ({
        idPermintaan: item.id,
        namaBarang: item.namaBarang,
        ukuran: item.ukuran,
        pemotong: item.stokPotong.pemotong.map((p: any) => p.user.nama),
        kodeKain: item.stokPotong.kodeKain,
        jumlahHasil: item.stokPotong.jumlahHasil,
        jumlahMinta: item.jumlahMinta,
      }));

      return res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching selesai data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  public static async getListPemotong(req: Request, res: Response) {
    try {
      const pemotong = await prisma.user.findMany({
        where: { role: 'POTONG' },
        select: {
          id: true,
          nama: true,
        },
      });
      return res.status(200).json(pemotong);
    } catch (error) {
      console.error('Error fetching pemotong data:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
