import { StatusPermintaan } from "../generated/prisma/enums.js";
import { prisma } from "./prisma.js";

export default class TrackLog {
  public static async logPermintaan(
    idPermintaan: string,
    message: string,
    status: StatusPermintaan,
  ) {
    const permintaan = await prisma.permintaanLog.create({
      data: {
        permintaanId: idPermintaan,
        keterangan: message,
        status: StatusPermintaan[status],
      },
    });
    console.log(idPermintaan, message, status);
  }

  public static logStatus(idPermintaan: string, status: StatusPermintaan) {
    const permintaan = prisma.permintaan.update({
      where: { id: idPermintaan },
      data: { status },
    });
    console.log(
      `Permintaan ${idPermintaan} status updated to: ${StatusPermintaan[status]}`,
    );
  }
}
