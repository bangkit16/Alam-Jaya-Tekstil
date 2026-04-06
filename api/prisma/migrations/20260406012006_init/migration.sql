-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'POTONG', 'PENJAHIT', 'RESI', 'PRINT', 'GUDANG');

-- CreateEnum
CREATE TYPE "StatusPermintaan" AS ENUM ('MENUNGGU_PROSES', 'PROSES', 'MASUK_STOK_GUDANG', 'SELESAI');

-- CreateEnum
CREATE TYPE "UkuranProduk" AS ENUM ('XL', 'XXL', 'L', 'M');

-- CreateEnum
CREATE TYPE "StatusStok" AS ENUM ('MASUK', 'KIRIM');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'POTONG',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KategoriProduk" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KategoriProduk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermintaanProduk" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "namaProduk" TEXT NOT NULL,
    "kodeKain" TEXT,
    "ukuran" "UkuranProduk" NOT NULL,
    "pengecek" TEXT,
    "pemotong" TEXT,
    "jumlah" INTEGER NOT NULL,
    "hasilPotongan" INTEGER NOT NULL DEFAULT 0,
    "isUrgent" BOOLEAN NOT NULL,
    "status" "StatusPermintaan" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PermintaanProduk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StokPotong" (
    "id" TEXT NOT NULL,
    "permintaanId" TEXT NOT NULL,
    "namaProduk" TEXT NOT NULL,
    "pengecek" TEXT,
    "penjahit" TEXT,
    "kodeKain" TEXT,
    "kodePotong" TEXT,
    "kategoriId" TEXT NOT NULL,
    "ukuran" "UkuranProduk" NOT NULL,
    "status" "StatusStok" DEFAULT 'MASUK',
    "admin" TEXT,
    "tanggalKirim" TIMESTAMP(3),
    "jumlah" INTEGER NOT NULL,

    CONSTRAINT "StokPotong_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_userId_key" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "KategoriProduk_slug_key" ON "KategoriProduk"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "KategoriProduk_kode_key" ON "KategoriProduk"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "StokPotong_permintaanId_key" ON "StokPotong"("permintaanId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermintaanProduk" ADD CONSTRAINT "PermintaanProduk_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StokPotong" ADD CONSTRAINT "StokPotong_permintaanId_fkey" FOREIGN KEY ("permintaanId") REFERENCES "PermintaanProduk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StokPotong" ADD CONSTRAINT "StokPotong_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "KategoriProduk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
