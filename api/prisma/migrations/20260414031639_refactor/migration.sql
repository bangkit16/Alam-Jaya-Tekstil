-- AlterTable
ALTER TABLE "ProsesStokPotong" ADD COLUMN     "kurirQCId" TEXT;

-- AddForeignKey
ALTER TABLE "ProsesStokPotong" ADD CONSTRAINT "ProsesStokPotong_kurirQCId_fkey" FOREIGN KEY ("kurirQCId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
