-- AlterEnum
ALTER TYPE "StatusPermintaan" ADD VALUE 'MASUK_STOK_GUDANG';

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
CREATE TABLE "StokPotong" (
    "id" TEXT NOT NULL,
    "permintaanId" TEXT NOT NULL,
    "namaProduk" TEXT NOT NULL,
    "kodeKain" TEXT,
    "kodePotong" TEXT,
    "kategoriId" TEXT NOT NULL,
    "ukuran" "UkuranProduk" NOT NULL,
    "jumlah" INTEGER NOT NULL,

    CONSTRAINT "StokPotong_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StokPotong_permintaanId_key" ON "StokPotong"("permintaanId");

-- AddForeignKey
ALTER TABLE "StokPotong" ADD CONSTRAINT "StokPotong_permintaanId_fkey" FOREIGN KEY ("permintaanId") REFERENCES "PermintaanProduk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StokPotong" ADD CONSTRAINT "StokPotong_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "KategoriProduk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
