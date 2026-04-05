import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  Role,
  UkuranProduk,
  StatusPermintaan,
} from "../src/generated/prisma/client";
import * as bcrypt from "bcryptjs";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("123", 10);

  const users = [
    {
      name: "Super Admin",
      username: "superadmin",
      email: "superadmin@gmail.com",
      role: Role.SUPERADMIN,
    },
    {
      name: "Bagian Potong",
      username: "potong",
      email: "potong@gmail.com",
      role: Role.POTONG,
    },
    {
      name: "Bagian Penjahit",
      username: "penjahit",
      email: "penjahit@gmail.com",
      role: Role.PENJAHIT,
    },
    {
      name: "Bagian Resi",
      username: "resi",
      email: "resi@gmail.com",
      role: Role.RESI,
    },
    {
      name: "Bagian Print",
      username: "print",
      email: "print@gmail.com",
      role: Role.PRINT,
    },
    {
      name: "Bagian Gudang",
      username: "gudang",
      email: "gudang@gmail.com",
      role: Role.GUDANG,
    },
  ];

  console.log("Memulai seeding data user...");

  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        username: u.username,
        password: passwordHash,
        role: u.role,
      },
    });
    console.log(`User created/found: ${user.email} with role ${user.role}`);
  }
  const userGudang = await prisma.user.findUnique({
    where: { email: "gudang@gmail.com" },
  });
  if (!userGudang) {
    console.log("User gudang tidak ditemukan, skip seeding produk.");
    return;
  }

  console.log("Memulai seeding data PermintaanProduk...");

  const permintaanData = [
    {
      userId: userGudang.id,
      namaProduk: "Kaos Polos Cotton Combed",
      kodeKain: null,
      ukuran: UkuranProduk.L,
      pengecek: null,
      jumlah: 100,
      isUrgent: true,
      status: StatusPermintaan.MENUNGGU_PROSES,
    },
    {
      userId: userGudang.id,
      namaProduk: "Hoodie Jumper",
      kodeKain: null,
      ukuran: UkuranProduk.M,
      pengecek: null,
      jumlah: 50,
      isUrgent: false,
      status: StatusPermintaan.MENUNGGU_PROSES,
    },
    {
      userId: userGudang.id,
      namaProduk: "Hoodie Merah Maroon",
      kodeKain: null,
      ukuran: UkuranProduk.XL,
      pengecek: null,
      jumlah: 70,
      isUrgent: false,
      status: StatusPermintaan.MENUNGGU_PROSES,
    },
    {
      userId: userGudang.id,
      namaProduk: "Jaket Kulit Vintage",
      kodeKain: null,
      ukuran: UkuranProduk.M,
      pengecek: null,
      jumlah: 10,
      isUrgent: false,
      status: StatusPermintaan.MENUNGGU_PROSES,
    },
  ];
  await prisma.permintaanProduk.createMany({ data: permintaanData });

  const kategoriData = [
    { name: "Hoodie", slug: "hoodie", kode: "HD" },
    { name: "Kaos", slug: "kaos", kode: "KS" },
    { name: "Singlet", slug: "singlet", kode: "SG" },
    { name: "TS Hoodie", slug: "ts-hoodie", kode: "TSH" },
    { name: "Sweater", slug: "sweater", kode: "SW" },
    { name: "Longsleeve", slug: "longsleeve", kode: "LS" },
    { name: "Kemeja", slug: "kemeja", kode: "KM" },
  ];
  console.log("Memulai seeding kategori...");

  for (const k of kategoriData) {
    await prisma.kategoriProduk.upsert({
      where: { id: "" }, // Upsert butuh ID atau unique field
      update: {},
      create: {
        name: k.name,
        slug: k.slug,
        kode: k.kode,
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
