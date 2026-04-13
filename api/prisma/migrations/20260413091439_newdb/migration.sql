/*
  Warnings:

  - A unique constraint covering the columns `[kodeBox]` on the table `Box` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Box_kodeBox_key" ON "Box"("kodeBox");
