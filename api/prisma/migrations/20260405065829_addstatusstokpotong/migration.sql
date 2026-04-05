-- CreateEnum
CREATE TYPE "StatusStok" AS ENUM ('MASUK', 'KIRIM');

-- AlterTable
ALTER TABLE "StokPotong" ADD COLUMN     "admin" TEXT,
ADD COLUMN     "status" "StatusStok" DEFAULT 'MASUK',
ADD COLUMN     "tanggalKirim" TIMESTAMP(3);
