/*
  Warnings:

  - The values [PENJAHIT] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The values [MASUK_STOK_GUDANG] on the enum `StatusPermintaan` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `updatedAt` to the `StokPotong` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('POTONG', 'STOKPOTONG', 'KURIR', 'JAHIT', 'QC', 'RESI', 'PRINT', 'GUDANG', 'STOKGUDANG', 'SUPERADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'POTONG';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "StatusPermintaan_new" AS ENUM ('MENUNGGU_PROSES', 'PROSES', 'SELESAI');
ALTER TABLE "PermintaanProduk" ALTER COLUMN "status" TYPE "StatusPermintaan_new" USING ("status"::text::"StatusPermintaan_new");
ALTER TYPE "StatusPermintaan" RENAME TO "StatusPermintaan_old";
ALTER TYPE "StatusPermintaan_new" RENAME TO "StatusPermintaan";
DROP TYPE "public"."StatusPermintaan_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "StatusStok" ADD VALUE 'PROSESKIRIM';
ALTER TYPE "StatusStok" ADD VALUE 'SELESAIKIRIM';

-- AlterTable
ALTER TABLE "StokPotong" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "tanggalSampai" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
