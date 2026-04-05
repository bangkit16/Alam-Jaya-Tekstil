/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "StatusPermintaan" AS ENUM ('MENUNGGU_PROSES', 'DIPROSES', 'SELESAI');

-- CreateEnum
CREATE TYPE "UkuranProduk" AS ENUM ('XL', 'XXL', 'L', 'M');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "PermintaanProduk" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "namaProduk" TEXT NOT NULL,
    "kodeKain" TEXT,
    "ukuran" "UkuranProduk" NOT NULL,
    "pengecek" TEXT,
    "jumlah" INTEGER NOT NULL,
    "hasilPotongan" INTEGER NOT NULL DEFAULT 0,
    "isUrgent" BOOLEAN NOT NULL,
    "status" "StatusPermintaan" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PermintaanProduk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PermintaanProduk_userId_key" ON "PermintaanProduk"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "PermintaanProduk" ADD CONSTRAINT "PermintaanProduk_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
