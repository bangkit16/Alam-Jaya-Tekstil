-- AlterTable
ALTER TABLE "Box" ADD COLUMN     "penerimaResiId" TEXT;

-- AddForeignKey
ALTER TABLE "Box" ADD CONSTRAINT "Box_penerimaResiId_fkey" FOREIGN KEY ("penerimaResiId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
