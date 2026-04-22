-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'ADMIN';
ALTER TYPE "Role" ADD VALUE 'STOK_RESI';
ALTER TYPE "Role" ADD VALUE 'PRESS';

-- AlterEnum
ALTER TYPE "StatusPermintaan" ADD VALUE 'ACC_STOK_RESI';

-- AlterTable
ALTER TABLE "Box" ADD COLUMN     "permintaanProdukId" TEXT;

-- AlterTable
ALTER TABLE "Permintaan" ADD COLUMN     "isDikirim" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "PermintaanProduk" (
    "id" TEXT NOT NULL,
    "kategoriId" TEXT NOT NULL,
    "namaBarang" TEXT NOT NULL,
    "ukuran" "UkuranProduk" NOT NULL,
    "jumlahMinta" INTEGER NOT NULL,
    "jenisPermintaan" "JenisPermintaan" NOT NULL,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "tanggalPermintaan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "permintaanId" TEXT,

    CONSTRAINT "PermintaanProduk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PermintaanProduk_permintaanId_key" ON "PermintaanProduk"("permintaanId");

-- AddForeignKey
ALTER TABLE "PermintaanProduk" ADD CONSTRAINT "PermintaanProduk_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "Kategori"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermintaanProduk" ADD CONSTRAINT "PermintaanProduk_permintaanId_fkey" FOREIGN KEY ("permintaanId") REFERENCES "Permintaan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Box" ADD CONSTRAINT "Box_permintaanProdukId_fkey" FOREIGN KEY ("permintaanProdukId") REFERENCES "PermintaanProduk"("id") ON DELETE SET NULL ON UPDATE CASCADE;
