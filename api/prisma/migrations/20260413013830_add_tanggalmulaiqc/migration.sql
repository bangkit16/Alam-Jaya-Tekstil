/*
  Warnings:

  - You are about to drop the column `tanggalQC` on the `QCStokPotong` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QCStokPotong" DROP COLUMN "tanggalQC",
ADD COLUMN     "tanggalMulaiQC" TIMESTAMP(3),
ADD COLUMN     "tanggalSelesaiQC" TIMESTAMP(3);
