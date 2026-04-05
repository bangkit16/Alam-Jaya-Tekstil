/*
  Warnings:

  - The values [DIPROSES] on the enum `StatusPermintaan` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusPermintaan_new" AS ENUM ('MENUNGGU_PROSES', 'PROSES', 'SELESAI');
ALTER TABLE "PermintaanProduk" ALTER COLUMN "status" TYPE "StatusPermintaan_new" USING ("status"::text::"StatusPermintaan_new");
ALTER TYPE "StatusPermintaan" RENAME TO "StatusPermintaan_old";
ALTER TYPE "StatusPermintaan_new" RENAME TO "StatusPermintaan";
DROP TYPE "public"."StatusPermintaan_old";
COMMIT;
