-- DropForeignKey
ALTER TABLE "QCStokPotong" DROP CONSTRAINT "QCStokPotong_boxId_fkey";

-- AlterTable
ALTER TABLE "QCStokPotong" ALTER COLUMN "boxId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "QCStokPotong" ADD CONSTRAINT "QCStokPotong_boxId_fkey" FOREIGN KEY ("boxId") REFERENCES "Box"("id") ON DELETE SET NULL ON UPDATE CASCADE;
