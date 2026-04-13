-- CreateTable
CREATE TABLE "QCPengecek" (
    "id" TEXT NOT NULL,
    "qcId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "QCPengecek_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QCPengecek" ADD CONSTRAINT "QCPengecek_qcId_fkey" FOREIGN KEY ("qcId") REFERENCES "QCStokPotong"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QCPengecek" ADD CONSTRAINT "QCPengecek_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
