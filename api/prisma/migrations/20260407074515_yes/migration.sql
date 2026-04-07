-- AlterEnum
ALTER TYPE "StatusStok" ADD VALUE 'PROSESPENGECEKAN';

-- AlterTable
ALTER TABLE "StokPotong" ADD COLUMN     "jumlah_diterima" INTEGER,
ADD COLUMN     "jumlah_lolos" INTEGER,
ADD COLUMN     "jumlah_reject" INTEGER;
