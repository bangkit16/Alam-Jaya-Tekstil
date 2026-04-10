import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  Role,
} from "../src/generated/prisma/client";
import * as bcrypt from "bcryptjs";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("123", 10);

  const users = [
    // SUPERADMIN
    {
      nama: "Bagas Maulana",
      username: "superadmin1",
      noHandphone: "081200000001",
      role: Role.SUPERADMIN,
    },
    {
      nama: "Aris Setiawan",
      username: "superadmin2",
      noHandphone: "081200000002",
      role: Role.SUPERADMIN,
    },

    // POTONG
    {
      nama: "Siti Aminah",
      username: "potong1",
      noHandphone: "081300000001",
      role: Role.POTONG,
    },
    {
      nama: "Rahmat Hidayat",
      username: "potong2",
      noHandphone: "081300000002",
      role: Role.POTONG,
    },

    // STOK_POTONG
    {
      nama: "Sisil Melati",
      username: "stokpotong1",
      noHandphone: "081400000001",
      role: Role.STOK_POTONG,
    },
    {
      nama: "Feri Irawan",
      username: "stokpotong2",
      noHandphone: "081400000002",
      role: Role.STOK_POTONG,
    },

    // KURIR
    {
      nama: "Joni Iskandar",
      username: "kurir1",
      noHandphone: "081500000001",
      role: Role.KURIR,
    },
    {
      nama: "Eko Prasetyo",
      username: "kurir2",
      noHandphone: "081500000002",
      role: Role.KURIR,
    },

    // JAHIT
    {
      nama: "Budi Santoso",
      username: "jahit1",
      noHandphone: "081600000001",
      role: Role.JAHIT,
    },
    {
      nama: "Ratna Sari",
      username: "jahit2",
      noHandphone: "081600000002",
      role: Role.JAHIT,
    },

    // QC
    {
      nama: "Sari Wahyuni",
      username: "qc1",
      noHandphone: "081700000001",
      role: Role.QC,
    },
    {
      nama: "Dian Pratama",
      username: "qc2",
      noHandphone: "081700000002",
      role: Role.QC,
    },

    // STOK_GUDANG
    {
      nama: "Fajar Nugraha",
      username: "stokgudang1",
      noHandphone: "081800000001",
      role: Role.STOK_GUDANG,
    },
    {
      nama: "Gani Wijaya",
      username: "stokgudang2",
      noHandphone: "081800000002",
      role: Role.STOK_GUDANG,
    },

    // Tambahan Role RESI & PRINT (Jika ada di Enum)
    {
      nama: "Dewi Lestari",
      username: "resi1",
      noHandphone: "081900000001",
      role: Role.RESI,
    },
    {
      nama: "Andi Wijaya",
      username: "print1",
      noHandphone: "082000000001",
      role: Role.PRINT,
    },
  ];

  console.log("--- Memulai Seeding Data User ---");

  for (const u of users) {
    await prisma.user.upsert({
      where: { username: u.username }, // Menggunakan username sebagai kunci unik pengecekan
      update: {},
      create: {
        nama: u.nama,
        username: u.username,
        password: passwordHash,
        noHandphone: u.noHandphone,
        role: u.role,
      },
    });
  }

  console.log(`✅ Berhasil seed ${users.length} users.`);

  const kategoriData = [
    { namaKategori: "Hoodie", slug: "hoodie", kodeKategori: "HD" },
    { namaKategori: "Kaos", slug: "kaos", kodeKategori: "KS" },
    { namaKategori: "Singlet", slug: "singlet", kodeKategori: "SG" },
    { namaKategori: "TS Hoodie", slug: "ts-hoodieKategori", kode: "TSH" },
    { namaKategori: "Sweater", slug: "sweater", kodeKategori: "SW" },
    { namaKategori: "Longsleeve", slug: "longsleeve", kodeKategori: "LS" },
    { namaKategori: "Kemeja", slug: "kemeja", kodeKategori: "KM" },
  ];
  console.log("Memulai seeding kategori...");

  for (const k of kategoriData) {
    await prisma.kategori.upsert({
      where: { id: "" }, // Upsert butuh ID atau unique field
      update: {},
      create: {
        namaKategori: k.namaKategori,
        slug: k.slug,
        kodeKategori: String(k.kodeKategori),
      },
    });
  }

  console.log("Seeding kategori selesai.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
    console.log("Seeding selesai.");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
