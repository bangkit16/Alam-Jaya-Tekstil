/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `KategoriProduk` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kode]` on the table `KategoriProduk` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "KategoriProduk_slug_key" ON "KategoriProduk"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "KategoriProduk_kode_key" ON "KategoriProduk"("kode");
