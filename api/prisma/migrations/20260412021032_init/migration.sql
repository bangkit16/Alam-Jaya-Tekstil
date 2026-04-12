-- CreateEnum
CREATE TYPE "Role" AS ENUM ('POTONG', 'STOK_POTONG', 'KURIR', 'JAHIT', 'QC', 'STOK_GUDANG', 'SUPERADMIN', 'RESI', 'PRINT');

-- CreateEnum
CREATE TYPE "JenisPermintaan" AS ENUM ('RESI', 'BORDIR');

-- CreateEnum
CREATE TYPE "StatusPermintaan" AS ENUM ('MENUNGGU_GUDANG', 'MENUNGGU_POTONG', 'PROSES_POTONG', 'MENUNGGU_STOK_POTONG', 'PROSES_STOK_POTONG', 'MENUNGGU_KURIR', 'PROSES_KURIR', 'MENUNGGU_JAHIT', 'PROSES_JAHIT', 'JEDA_JAHIT', 'MENUNGGU_QC', 'PROSES_QC', 'MASUK_BOX', 'ACC_GUDANG');

-- CreateEnum
CREATE TYPE "StatusStokPotong" AS ENUM ('MENUNGGU', 'PROSES', 'SELESAI', 'KIRIM');

-- CreateEnum
CREATE TYPE "StatusProses" AS ENUM ('MENUNGGU_PENGIRIMAN', 'PROSES_PENGIRIMAN', 'SELESAI_PENGIRIMAN', 'DIKERJAKAN', 'JEDA', 'SELESAI_JAHIT');

-- CreateEnum
CREATE TYPE "StatusQC" AS ENUM ('MENUNGGU', 'PROSES', 'MASUK_BOX', 'SELESAI');

-- CreateEnum
CREATE TYPE "StatusBox" AS ENUM ('MENUNGGU', 'ACC', 'KIRIM');

-- CreateEnum
CREATE TYPE "UkuranProduk" AS ENUM ('XL', 'XXL', 'L', 'M');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "noHandphone" TEXT NOT NULL,
    "role" "Role" NOT NULL,
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
CREATE TABLE "Kategori" (
    "id" TEXT NOT NULL,
    "namaKategori" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "kodeKategori" TEXT NOT NULL,

    CONSTRAINT "Kategori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permintaan" (
    "id" TEXT NOT NULL,
    "kategoriId" TEXT NOT NULL,
    "namaBarang" TEXT NOT NULL,
    "ukuran" "UkuranProduk" NOT NULL,
    "jumlahMinta" INTEGER NOT NULL,
    "jenisPermintaan" "JenisPermintaan" NOT NULL,
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "tanggalMasuk" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusPermintaan" NOT NULL,

    CONSTRAINT "Permintaan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PermintaanLog" (
    "id" TEXT NOT NULL,
    "permintaanId" TEXT NOT NULL,
    "status" "StatusPermintaan" NOT NULL,
    "keterangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PermintaanLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StokPotong" (
    "id" TEXT NOT NULL,
    "permintaanId" TEXT NOT NULL,
    "kodeKain" TEXT NOT NULL,
    "kodeStokPotongan" TEXT,
    "tanggalMasuk" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalCek" TIMESTAMP(3),
    "tanggalSelesai" TIMESTAMP(3),
    "jumlahHasil" INTEGER,
    "jumlahLolos" INTEGER,
    "jumlahReject" INTEGER,
    "notes" TEXT,
    "status" "StatusStokPotong" NOT NULL,

    CONSTRAINT "StokPotong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StokPotongPemotong" (
    "id" TEXT NOT NULL,
    "stokPotongId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "StokPotongPemotong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StokPotongPengecek" (
    "id" TEXT NOT NULL,
    "stokPotongId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "StokPotongPengecek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProsesStokPotong" (
    "id" TEXT NOT NULL,
    "stokPotongId" TEXT NOT NULL,
    "penjahitId" TEXT,
    "kurirId" TEXT,
    "tanggalBerangkat" TIMESTAMP(3),
    "tanggalSampai" TIMESTAMP(3),
    "tanggalMulaiJahit" TIMESTAMP(3),
    "tanggalSelesaiJahit" TIMESTAMP(3),
    "jumlahSelesai" INTEGER,
    "notes" TEXT,
    "status" "StatusProses" NOT NULL,

    CONSTRAINT "ProsesStokPotong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QCStokPotong" (
    "id" TEXT NOT NULL,
    "stokPotongId" TEXT NOT NULL,
    "boxId" TEXT NOT NULL,
    "jumlahLolos" INTEGER,
    "jumlahReject" INTEGER,
    "jumlahKotor" INTEGER,
    "jumlahTurunSize" INTEGER,
    "jumlahPermak" INTEGER,
    "tanggalQC" TIMESTAMP(3),
    "notes" TEXT,
    "status" "StatusQC" NOT NULL,

    CONSTRAINT "QCStokPotong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Box" (
    "id" TEXT NOT NULL,
    "permintaanId" TEXT NOT NULL,
    "kodeBox" TEXT NOT NULL,
    "namaBox" TEXT NOT NULL,
    "penanggungJawabId" TEXT,
    "penerimaId" TEXT,
    "tanggalMasuk" TIMESTAMP(3),
    "tanggalMasukGudang" TIMESTAMP(3),
    "status" "StatusBox" NOT NULL,

    CONSTRAINT "Box_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_noHandphone_key" ON "User"("noHandphone");

-- CreateIndex
CREATE UNIQUE INDEX "Session_userId_key" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Kategori_slug_key" ON "Kategori"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "StokPotong_permintaanId_key" ON "StokPotong"("permintaanId");

-- CreateIndex
CREATE UNIQUE INDEX "ProsesStokPotong_stokPotongId_key" ON "ProsesStokPotong"("stokPotongId");

-- CreateIndex
CREATE UNIQUE INDEX "QCStokPotong_stokPotongId_key" ON "QCStokPotong"("stokPotongId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permintaan" ADD CONSTRAINT "Permintaan_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "Kategori"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PermintaanLog" ADD CONSTRAINT "PermintaanLog_permintaanId_fkey" FOREIGN KEY ("permintaanId") REFERENCES "Permintaan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StokPotong" ADD CONSTRAINT "StokPotong_permintaanId_fkey" FOREIGN KEY ("permintaanId") REFERENCES "Permintaan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StokPotongPemotong" ADD CONSTRAINT "StokPotongPemotong_stokPotongId_fkey" FOREIGN KEY ("stokPotongId") REFERENCES "StokPotong"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StokPotongPemotong" ADD CONSTRAINT "StokPotongPemotong_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StokPotongPengecek" ADD CONSTRAINT "StokPotongPengecek_stokPotongId_fkey" FOREIGN KEY ("stokPotongId") REFERENCES "StokPotong"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StokPotongPengecek" ADD CONSTRAINT "StokPotongPengecek_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProsesStokPotong" ADD CONSTRAINT "ProsesStokPotong_stokPotongId_fkey" FOREIGN KEY ("stokPotongId") REFERENCES "StokPotong"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProsesStokPotong" ADD CONSTRAINT "ProsesStokPotong_penjahitId_fkey" FOREIGN KEY ("penjahitId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProsesStokPotong" ADD CONSTRAINT "ProsesStokPotong_kurirId_fkey" FOREIGN KEY ("kurirId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QCStokPotong" ADD CONSTRAINT "QCStokPotong_stokPotongId_fkey" FOREIGN KEY ("stokPotongId") REFERENCES "StokPotong"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QCStokPotong" ADD CONSTRAINT "QCStokPotong_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Box" ADD CONSTRAINT "Box_permintaanId_fkey" FOREIGN KEY ("permintaanId") REFERENCES "Permintaan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Box" ADD CONSTRAINT "Box_penanggungJawabId_fkey" FOREIGN KEY ("penanggungJawabId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Box" ADD CONSTRAINT "Box_penerimaId_fkey" FOREIGN KEY ("penerimaId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
