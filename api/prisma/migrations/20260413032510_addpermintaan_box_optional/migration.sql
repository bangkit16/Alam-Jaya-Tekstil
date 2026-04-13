-- DropForeignKey
ALTER TABLE "Box" DROP CONSTRAINT "Box_permintaanId_fkey";

-- AlterTable
ALTER TABLE "Box" ALTER COLUMN "permintaanId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Box" ADD CONSTRAINT "Box_permintaanId_fkey" FOREIGN KEY ("permintaanId") REFERENCES "Permintaan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
