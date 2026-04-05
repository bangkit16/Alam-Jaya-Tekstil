-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'GUDANG';

-- DropForeignKey
ALTER TABLE "PermintaanProduk" DROP CONSTRAINT "PermintaanProduk_userId_fkey";

-- DropIndex
DROP INDEX "PermintaanProduk_userId_key";

-- AlterTable
ALTER TABLE "PermintaanProduk" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "PermintaanProduk" ADD CONSTRAINT "PermintaanProduk_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
