import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import TrackLog from '../lib/trackLog.js';
import { JenisPermintaan, StatusBox, StatusPermintaan, StatusPermintaanProduk, StatusQC, UkuranProduk } from '../generated/prisma/enums.js';
import z from 'zod';
import { Validator } from '../lib/validator.js';
import { getPagination, wrapPagination } from '../utils/pagination.js';
import { Prisma } from '../generated/prisma/browser.js';

export class StokResiController {
  public static async getListPermintaanProduk(req: Request, res: Response) {
    try {
      const { prisma: pg, page, limit } = getPagination(req);

      const search = req.query.search as string;

      const whereCondition: Prisma.PermintaanProdukWhereInput = {
        StatusPermintaan: StatusPermintaanProduk.DIPROSES,

        ...(search && {
          OR: [
            {
              namaBarang: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }),
      };

      const [permintaanProduk, total] = await Promise.all([
        prisma.permintaanProduk.findMany({
          where: whereCondition,
          ...pg,
          select: {
            id: true,
            namaBarang: true,
            kategori: {
              select: {
                namaKategori: true,
              },
            },
            jenisPermintaan: true,
            ukuran: true,
            isUrgent: true,
            jumlahMinta: true,
            tanggalPermintaan: true,
            StatusPermintaan: true,
          },
        }),
        prisma.permintaanProduk.count({
          where: whereCondition,
        }),
      ]);

      const data = permintaanProduk.map((item: any) => ({
        idPermintaanProduk: item.id,
        namaBarang: item.namaBarang,
        kategori: item.kategori.namaKategori,
        jenisPermintaan: item.jenisPermintaan,
        ukuran: item.ukuran,
        isUrgent: item.isUrgent,
        jumlahMinta: item.jumlahMinta,
        tanggalPermintaan: item.tanggalMasuk,
      }));

      return res.status(200).json({
        data: data,
        meta: wrapPagination(total, page, limit),
      });
    } catch (error: any) {
      console.error('Error create permintaan produk:', error);

      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  }
  public static async createPermintaanProduk(req: Request, res: Response) {
    const schema = z.object({
      body: z.object({
        namaBarang: z.string().min(1, 'Nama barang harus diisi'),
        kategori: z.string().min(1, 'Kategori harus dipilih'),
        ukuran: z.string().min(1, 'Ukuran harus diisi'),
        isUrgent: z.boolean('Urgent harus berisi true/false').default(false),
        jumlahMinta: z.number().positive('Jumlah harus lebih dari 0'),
      }),
    });
    try {
      const validated = Validator(schema)(req, res);
      if (!validated) return;

      const { namaBarang, kategori, ukuran, isUrgent, jumlahMinta } = validated.body;

      const kategoriData = await prisma.kategori.findUnique({
        where: {
          slug: kategori,
        },
      });

      if (!kategoriData) {
        return res.status(400).json({
          message: 'Kategori tidak ditemukan',
        });
      }

      const newPermintaan = await prisma.permintaanProduk.create({
        data: {
          namaBarang,
          kategoriId: kategoriData.id,
          jenisPermintaan: JenisPermintaan.RESI,
          ukuran: UkuranProduk[ukuran as keyof typeof UkuranProduk],
          isUrgent,
          jumlahMinta,
          StatusPermintaan: StatusPermintaanProduk.DIPROSES,
        },
      });

      return res.json({
        message: 'Permintaan produk berhasil dikirim',
        status: StatusPermintaanProduk.DIPROSES,
        // data: newPermintaan,
      });
    } catch (error) {
      console.error('Error create permintaan produk:', error);

      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  }
}
