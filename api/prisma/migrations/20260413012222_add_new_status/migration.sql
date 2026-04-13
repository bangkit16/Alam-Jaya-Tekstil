-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "StatusProses" ADD VALUE 'MENUNGGU_PENGIRIMAN_KE_QC';
ALTER TYPE "StatusProses" ADD VALUE 'PROSES_PENGIRIMAN_KE_QC';
ALTER TYPE "StatusProses" ADD VALUE 'SELESAI_PENGIRIMAN_KE_QC';

-- AlterTable
ALTER TABLE "ProsesStokPotong" ADD COLUMN     "tanggalBerangkatKeQC" TIMESTAMP(3),
ADD COLUMN     "tanggalSampaiKeQC" TIMESTAMP(3);
