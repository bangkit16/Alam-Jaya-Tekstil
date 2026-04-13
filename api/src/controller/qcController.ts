import type { Request, Response } from "express";
import { customAlphabet } from "nanoid";
import { prisma } from "../lib/prisma.js";
import TrackLog from "../lib/trackLog.js";
import {
  StatusBox,
  StatusPermintaan,
  StatusProses,
  StatusQC,
} from "../generated/prisma/enums.js";
import { Validator } from "../lib/validator.js";
import z from "zod";

export default class QCController {
  private static generateUniqueBarcode(prefix = "BOX"): string {
    // 1. Ambil Tanggal (Format: YYMMDD)
    const now = new Date();
    const dateStr = now.toISOString().slice(2, 10).replace(/-/g, ""); // Contoh: 240522

    // 2. Random String Pendek (Menggunakan nanoid agar aman & unik)
    // Kita gunakan uppercase & angka saja agar mudah dibaca barcode scanner
    const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 4);
    const randomStr = nanoid();

    // 3. Timestamp (3 digit terakhir milidetik untuk ekstra keunikan)
    const ms = now.getMilliseconds().toString().padStart(3, "0").slice(-2);

    // Hasil: BOX-240522-A1Z9-99
    return `${prefix}-${dateStr}-${randomStr}-${ms}`;
  }
  public static async getDataMenunggu(req: Request, res: Response) {
    try {
      const dataMenunggu = await prisma.qCStokPotong.findMany({
        where: {
          status: StatusQC.MENUNGGU,
        },
        select: {
          id: true,
          notes: true,
          stokPotong: {
            select: {
              proses: {
                select: {
                  jumlahSelesai: true,
                  tanggalSelesaiJahit: true,
                  penjahit: {
                    select: {
                      nama: true,
                    },
                  },
                },
              },
              kodeStokPotongan: true,
              jumlahLolos: true,
              permintaan: {
                select: {
                  id: true,
                  namaBarang: true,
                  ukuran: true,
                  isUrgent: true,
                },
              },
            },
          },
        },
      });
      const data = dataMenunggu.map((item) => ({
        idQC: item.id,
        namaBarang: item.stokPotong.permintaan.namaBarang,
        ukuran: item.stokPotong.permintaan.ukuran,
        namaPenjahit: item.stokPotong?.proses?.penjahit?.nama,
        kodeStokPotongan: item.stokPotong.kodeStokPotongan,
        jumlahSelesaiJahit: item.stokPotong.proses?.jumlahSelesai,
        tanggalSelesaiJahit: item.stokPotong.proses?.tanggalSelesaiJahit,
        isUrgent: item.stokPotong.permintaan.isUrgent,
      }));
      return res.json(data);
    } catch (error) {
      console.error("Error fetching data selesai:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async updateProsesDikerjakan(req: Request, res: Response) {
    const schema = z.object({
      params: z.object({ idQC: z.string().uuid() }),
    });

    try {
      const validated = Validator(schema)(req, res);
      if (!validated) return;
      const { idQC } = validated.params;
      const updateProses = await prisma.qCStokPotong.update({
        where: {
          id: idQC,
          status: StatusQC.MENUNGGU,
        },
        data: {
          status: StatusQC.PROSES,
          tanggalMulaiQC: new Date(),
          stokPotong: {
            update: {
              permintaan: {
                update: {
                  status: StatusPermintaan.PROSES_QC,
                },
              },
            },
          },
        },
        select: {
          stokPotong: {
            select: {
              permintaan: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
      TrackLog.logPermintaan(
        String(updateProses.stokPotong.permintaan.id),
        "Hasil jahitan sedang di proses QC",
        StatusPermintaan.PROSES_QC,
      );
      return res.status(200).json({
        message: "Hasil jahitan sedang di proses QC",
        status: "PROSES_QC",
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message:
            "ID Proses Stok Potong tidak ditemukan atau sudah diproses sebelumnya",
        });
      }
      console.error("Error updating proses stok potong:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async getDataProses(req: Request, res: Response) {
    try {
      const dataProses = await prisma.qCStokPotong.findMany({
        where: {
          status: StatusQC.PROSES,
        },
        select: {
          id: true,
          notes: true,
          tanggalMulaiQC: true,
          stokPotong: {
            select: {
              proses: {
                select: {
                  jumlahSelesai: true,
                  tanggalSelesaiJahit: true,
                  penjahit: {
                    select: {
                      nama: true,
                    },
                  },
                },
              },
              kodeStokPotongan: true,
              jumlahLolos: true,
              permintaan: {
                select: {
                  id: true,
                  namaBarang: true,
                  ukuran: true,
                  isUrgent: true,
                },
              },
            },
          },
        },
      });
      const data = dataProses.map((item) => ({
        idQC: item.id,
        namaBarang: item.stokPotong.permintaan.namaBarang,
        ukuran: item.stokPotong.permintaan.ukuran,
        namaPenjahit: item.stokPotong?.proses?.penjahit?.nama,
        kodeStokPotongan: item.stokPotong.kodeStokPotongan,
        jumlahSelesaiJahit: item.stokPotong.proses?.jumlahSelesai,
        tanggalSelesaiJahit: item.stokPotong.proses?.tanggalSelesaiJahit,
        tanggalMulaiQC: item.tanggalMulaiQC,
        isUrgent: item.stokPotong.permintaan.isUrgent,
      }));
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching data selesai:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async updateProsesSelesai(req: Request, res: Response) {
    const schema = z.object({
      params: z.object({
        idQC: z.string().uuid().min(1, "ID QC harus berupa UUID yang valid"),
      }),
      body: z.object({
        idPengecek: z.preprocess(
          (val) => (Array.isArray(val) ? val : [val]), // Jika bukan array, bungkus jadi array
          z.array(z.string().uuid()),
        ),
        jumlahLolos: z.coerce.number().int().default(0),
        jumlahPermak: z.coerce.number().int().default(0),
        jumlahReject: z.coerce.number().int().default(0),
        jumlahTurunSize: z.coerce.number().int().default(0),
        jumlahKotor: z.coerce.number().int().default(0),
      }),
    });

    try {
      const validated = Validator(schema)(req, res);
      if (!validated) return;
      const { idQC } = validated.params;
      const {
        idPengecek,
        jumlahLolos,
        jumlahPermak,
        jumlahReject,
        jumlahTurunSize,
        jumlahKotor,
      } = validated.body;

      const users = await prisma.user.findMany({
        where: {
          id: { in: idPengecek },
        },
        select: {
          nama: true,
          noHandphone: true,
        },
      });

      console.log(users);

      // Validasi jika ada ID yang tidak terdaftar di database
      if (users.length !== idPengecek.length) {
        return res.status(404).json({
          message: "Salah satu atau semua ID Pengecek tidak ditemukan",
        });
      }

      const updateProses = await prisma.qCStokPotong.update({
        where: {
          id: idQC,
          status: StatusQC.PROSES,
        },
        data: {
          status: StatusQC.MASUK_BOX,
          tanggalSelesaiQC: new Date(),
          pengecek: {
            create: idPengecek.map((id) => ({
              user: { connect: { id: id } }, // Menghubungkan ke User melalui tabel QCPengecek
            })),
          },
          jumlahLolos,
          jumlahPermak,
          jumlahReject,
          jumlahTurunSize,
          jumlahKotor,
        },
        select: {
          jumlahLolos: true,
          stokPotong: {
            select: {
              permintaan: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
      TrackLog.logPermintaan(
        String(updateProses.stokPotong.permintaan.id),
        `Hasil jahitan telah selesai di cek, Jumlah Lolos : ${updateProses.jumlahLolos}. Pengecek: ${users.map((user) => `${user.nama} (${user.noHandphone})`).join(", ")}.`,
        StatusPermintaan.MASUK_BOX,
      );
      return res.status(200).json({
        message: "Hasil jahitan telah selesai di cek dan masuk box",
        status: "MASUK_BOX",
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message:
            "ID Proses Stok Potong tidak ditemukan atau sudah diproses sebelumnya",
        });
      }
      console.error("Error updating proses stok potong:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async getDataMasukBox(req: Request, res: Response) {
    try {
      const dataProses = await prisma.qCStokPotong.findMany({
        where: {
          status: StatusQC.MASUK_BOX,
        },
        select: {
          id: true,
          notes: true,
          tanggalSelesaiQC: true,
          jumlahLolos: true,
          stokPotong: {
            select: {
              proses: {
                select: {
                  jumlahSelesai: true,
                  tanggalSelesaiJahit: true,
                  penjahit: {
                    select: {
                      nama: true,
                    },
                  },
                },
              },
              kodeStokPotongan: true,
              jumlahLolos: true,
              permintaan: {
                select: {
                  id: true,
                  namaBarang: true,
                  ukuran: true,
                  isUrgent: true,
                },
              },
            },
          },
        },
      });

      const data = dataProses.map((item) => ({
        idQC: item.id,
        namaBarang: item.stokPotong.permintaan.namaBarang,
        ukuran: item.stokPotong.permintaan.ukuran,
        isUrgent: item.stokPotong.permintaan.isUrgent,
        kodeStokPotongan: item.stokPotong.kodeStokPotongan,
        namaPenjahit: item.stokPotong?.proses?.penjahit?.nama,
        jumlahLolos: item.jumlahLolos,
        tanggalSelesaiQC: item.tanggalSelesaiQC,
      }));
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching data selesai:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async postMasukBox(req: Request, res: Response) {
    const schema = z.object({
      body: z.object({
        idPenanggungJawabBox: z.string().uuid({
          message: "ID Penanggung Jawab harus berupa UUID yang valid",
        }),
        namaBox: z.string().min(1, "Nama Box tidak boleh kosong"),
        idQc: z
          .array(
            z.string().uuid({
              message: "Setiap ID QC harus berupa UUID yang valid",
            }),
          )
          .min(1, "Minimal harus ada satu ID QC yang dikirim"),
      }),
    });

    try {
      const validated = Validator(schema)(req, res);
      if (!validated) return;
      const { idPenanggungJawabBox, namaBox, idQc } = validated.body;

      const users = await prisma.user.findUnique({
        where: {
          id: idPenanggungJawabBox,
        },
        select: {
          nama: true,
          noHandphone: true,
        },
      });

      const kodeBox = QCController.generateUniqueBarcode("BOX");

      // Validasi jika ada ID yang tidak terdaftar di database
      if (!users) {
        return res.status(404).json({
          message: "ID Penanggung Jawab Box tidak ditemukan",
        });
      }

      const box = await prisma.box.create({
        data: {
          namaBox: namaBox,
          status: StatusBox.MENUNGGU,
          kodeBox: kodeBox,
          penanggungJawab: {
            connect: { id: idPenanggungJawabBox },
          },
          qc: {
            connect: idQc.map((id) => ({ id: id })),
          },
          tanggalMasuk: new Date(),
        },
        select: {
          id: true,
          namaBox: true,
          penanggungJawab: {
            select: {
              nama: true,
              noHandphone: true,
            },
          },
          kodeBox: true,
        },
      });

      const updatedQC = await prisma.$transaction(
        idQc.map((id) =>
          prisma.qCStokPotong.update({
            where: {
              id: id,
              status: StatusQC.MASUK_BOX, // Memastikan hanya yang statusnya benar yang terupdate
            },
            data: {
              status: StatusQC.SELESAI,
              boxId: box.id,
            },
            select: {
              id: true,
              stokPotong: {
                select: {
                  permintaan: { select: { id: true } },
                },
              },
            },
          }),
        ),
      );

      // Sekarang `updatedQC` adalah Array of Objects, kamu bisa looping untuk TrackLog
      updatedQC.forEach((qc) => {
        TrackLog.logPermintaan(
          qc.stokPotong.permintaan.id,
          "Hasil jahitan lolos QC dan masuk box " +
            box.namaBox +
            " Kode Box: " +
            box.kodeBox +
            " dengan penanggung jawab " +
            box.penanggungJawab?.nama +
            " (" +
            box.penanggungJawab?.noHandphone +
            ")",
          StatusPermintaan.MASUK_BOX,
        );
      });

      return res.status(200).json({
        message: "Hasil jahitan telah selesai di cek dan masuk box",
        status: "MASUK_BOX",
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message: "ID QC tidak ditemukan atau sudah diproses sebelumnya",
        });
      }
      console.error("Error updating proses stok potong:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async getDataSelesai(req: Request, res: Response) {
    
    try {
      const data = await prisma.box.findMany({
        where: { status: { in: [StatusBox.MENUNGGU] } },
        select: {
          id: true,
          namaBox: true,
          kodeBox: true,
          tanggalMasuk: true,
          penanggungJawab: {
            select: {
              nama: true,
              noHandphone: true,
            },
          },
          qc: {
            select: {
              tanggalSelesaiQC: true,
              id: true,
              jumlahLolos: true,
              stokPotong: {
                select: {
                  kodeStokPotongan: true,
                  permintaan: {
                    select: {
                      id: true,
                      namaBarang: true,
                      ukuran: true,
                      isUrgent: true,
                    },
                  },
                },
              },
            },
          }
        },
      });
      const mappedData = data.map((item) => ({
        idBox: item.id,
        namaBox: item.namaBox, // Atau item.qc[0]?.stokPotong.permintaan.namaBarang jika ingin nama barang
        namaPenanggungJawab: item.penanggungJawab?.nama,
        kodeBox: item.kodeBox,
        tanggalMasukStok: item.tanggalMasuk,
        stokPotongan: item.qc.map((q) => ({
          idQC: q.id,
          namaBarang: q.stokPotong.permintaan.namaBarang,
          ukuran: q.stokPotong.permintaan.ukuran,
          jumlah: q.jumlahLolos,
          tanggalSelesaiQC: q.tanggalSelesaiQC,
          kodeStokPotongan: q.stokPotong.kodeStokPotongan,
          isUrgent: q.stokPotong.permintaan.isUrgent,
        })),
      }));
      return res.status(200).json(mappedData);
    } catch (error) {
      console.error("Error fetching data selesai:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async getListPengecek(req: Request, res: Response) {
    try {
      const pengecek = await prisma.user.findMany({
        where: { role: "QC" },
        select: {
          id: true,
          nama: true,
        },
      });
      return res.status(200).json(pengecek);
    } catch (error) {
      console.error("Error fetching pengecek data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  public static async getListPenanggungJawabBox(req: Request, res: Response) {
    try {
      const penanggungJawabBox = await prisma.user.findMany({
        where: { role: "QC" },
        select: {
          id: true,
          nama: true,
        },
      });
      return res.status(200).json(penanggungJawabBox);
    } catch (error) {
      console.error("Error fetching penanggung jawab box data:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
