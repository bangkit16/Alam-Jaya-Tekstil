import {  Router } from "express";
import type { Request, Response } from "express";
import StokPotong from "../controller/stokPotongController.js";
import QCController from "../controller/qcController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: QC
 *   description: Divisi Kurir (Menunggu, Proses, Selesai)
 */

/**
 * @swagger
 * /qc/menunggu:
 *   get:
 *     summary: Mendapatkan List Data Menunggu (Tab Menunggu)
 *     tags: [QC]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               - idQC: "bcvc3sad22e-fe64-4343-a275-5b2de4ad8615"
 *                 namaBarang: "Hoodie Green Navy"
 *                 ukuran: "L"
 *                 namaPenjahit: "Sari"
 *                 kodeStokPotongan: "AD-0123-A1"
 *                 jumlahSelesaiJahit: 20
 *                 tanggalSelesaiJahit : "2023-10-27T14:00:00Z"
 *               - idQC: "40ea5347-a01f-46e1-a843-194effa93c1f"
 *                 namaBarang: "Hoodie Green Navy"
 *                 ukuran: "L"
 *                 namaPenjahit: "Sari"
 *                 kodeStokPotongan: "AD-0123-A2"
 *                 jumlahSelesaiJahit: 20
 *                 tanggalSelesaiJahit : "2023-10-27T14:00:00Z"
 *
 */

router.get("/menunggu", QCController.getDataMenunggu);

/**
 * @swagger
 * /qc/menunggu/{idQC}:
 *   put:
 *     summary: DIVISI QC (Tab Menunggu - Modal Pindah ke Proses)
 *     tags: [QC]
 *     parameters:
 *       - in: path
 *         name: idQC
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stok potong sedang dikirimkan
 *         content:
 *           application/json:
 *             example:
 *               message: "Stok potongan berhasil di proses"
 *               status : "PROSES_QC"
 */

router.put("/menunggu/:idQC", QCController.updateProsesDikerjakan);

/**
 * @swagger
 * /qc/proses:
 *   get:
 *     summary: DIVISI QC (Tab Proses)
 *     tags: [QC]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               - idQC: "bcvc3sad22e-fe64-4343-a275-5b2de4ad8615"
 *                 namaBarang: "Hoodie Green Navy"
 *                 ukuran: "L"
 *                 namaPenjahit: "Sari"
 *                 kodeStokPotongan: "AD-0123-A1"
 *                 jumlahSelesaiJahit: 20
 *                 tanggalSelesaiJahit : "2023-10-27T14:00:00Z"
 *               - idQC: "40ea5347-a01f-46e1-a843-194effa93c1f"
 *                 namaBarang: "Hoodie Green Navy"
 *                 ukuran: "L"
 *                 namaPenjahit: "Sari"
 *                 kodeStokPotongan: "AD-0123-A2"
 *                 jumlahSelesaiJahit: 20
 *                 tanggalSelesaiJahit : "2023-10-27T14:00:00Z"
 *
 */

router.get("/proses", QCController.getDataProses);

/**
 * @swagger
 * /qc/proses/{idQC}:
 *   put:
 *     summary: DIVISI QC (Tab Proses - Modal Pindah ke Masuk Box)
 *     tags: [QC]
 *     parameters:
 *       - in: path
 *         name: idQC
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idPengecek:
 *                 type: string
 *               jumlahLolos:
 *                 type: integer
 *               jumlahPermak:
 *                 type: integer
 *               jumlahReject:
 *                 type: integer
 *               jumlahTurunSize:
 *                 type: integer
 *               jumlahKotor:
 *                 type: integer
 *           example:
 *             idPengecek: "dfcsad2e-mku1-4343-a275-5b2de4ad8615"
 *             jumlahLolos: 15
 *             jumlahPermak: 5
 *             jumlahReject: 0
 *             jumlahTurunSize: 0
 *             jumlahKotor: 0
 *     responses:
 *       200:
 *         description: Stok potong selesai di cek
 *         content:
 *           application/json:
 *             example:
 *               message: "Stok potongan berhasil di di cek"
 *               status : "MASUK_BOX"
 */

router.put("/proses/:idQC", QCController.updateProsesSelesai);

/**
 * @swagger
 * /qc/masukbox:
 *   get:
 *     summary: Mendapatkan List Data Mauk Box (Tab Masuk Box)
 *     tags: [QC]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               - idQC: "bcvc3sad22e-fe64-4343-a275-5b2de4ad8615"
 *                 namaBarang: "Hoodie Green Navy"
 *                 ukuran: "L"
 *                 namaPenjahit: "Sari"
 *                 kodeStokPotongan: "AD-0123-A1"
 *                 jumlahLolos: 15
 *                 tanggalSelesaiQC : "2023-10-27T14:00:00Z"
 *               - idQC: "40ea5347-a01f-46e1-a843-194effa93c1f"
 *                 namaBarang: "Hoodie Green Navy"
 *                 ukuran: "L"
 *                 namaPenjahit: "Sari"
 *                 kodeStokPotongan: "AD-0123-A2"
 *                 jumlahLolos: 25
 *                 tanggalSelesaiQC : "2023-10-27T14:00:00Z"
 *
 */

router.get("/masukbox", QCController.getDataMasukBox);

/**
 * @swagger
 * /qc/masukbox:
 *   post:
 *     summary: DIVISI QC (Tab Menunggu - Modal Pindah ke Proses)
 *     tags: [QC]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idPenanggungJawabBox:
 *                  type: string
 *               idQc:
 *                 type: array
 *                 description: Daftar UUID QC yang akan diproses
 *                 items:
 *                   type: string
 *                   format: uuid
 *             example:
 *               idPenanggungJawabBox: "dfcsad2e-mku1-4343-a275-5b2de4ad8615"
 *               namaBox: "BOX-HOODIE-001"
 *               idQc: 
 *                 - "dfcsad2e-mku1-4343-a275-5b2de4ad8615"
 *                 - "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2g3h4i5j"
 *     responses:
 *       200:
 *         description: Stok potong sedang dikirimkan
 *         content:
 *           application/json:
 *             example:
 *               message: "Stok potongan hasil QC berhasil masuk box"
 *               status: "MASUK_BOX"
 */

router.post("/masukbox/", QCController.postMasukBox);

/**
 * @swagger
 * /qc/selesai:
 *   get:
 *     summary: DIVISI QC (Tab Selesai)
 *     tags: [QC]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               - idBox: "bcvc3sad22e-fe64-4343-a275-5b2de4ad8615"
 *                 namaBox: "Hoodie Green Navy"
 *                 namaPenanggungJawab: "Joko"
 *                 kodeBox: "BOX6482416A1"
 *                 tanggalMasukStok : "2023-10-27T14:00:00Z"
 *                 stokPotongan:
 *                 - idQC: "bcvc3sad22e-fe64-4343-a275-5b2de4ad8615"
 *                   namaBarang: "Hoodie Green Navy"
 *                   ukuran: "L"
 *                   jumlah: 15
 *                   tanggalSelesaiQC : "2023-10-27T14:00:00Z"
 *                   kodeStokPotongan : "AD-0123-A1"
 *                 - idQC: "bcvc3sASD22e-fe64-4343-a275-5b2de4ad8615"
 *                   namaBarang: "Hoodie Green Navy"
 *                   ukuran: "L"
 *                   jumlah: 15
 *                   tanggalSelesaiQC : "2023-10-27T14:00:00Z"
 *                   kodeStokPotongan : "AD-0123-A1"
 *               - idBox: "bcvc3sad22e-4343-a275-5b2de4ad8615"
 *                 namaBox: "Hoodie Green Navy"
 *                 namaPenanggungJawab: "Joko"
 *                 kodeBox: "BOX648241612A1"
 *                 tanggalMasukStok : "2023-10-27T14:00:00Z"
 *                 stokPotongan:
 *                 - idQC: "bcvc789d22e-fe64-4343-a275-5b2de4ad8615"
 *                   namaBarang: "Hoodie Green Navy"
 *                   ukuran: "L"
 *                   jumlah: 15
 *                   tanggalSelesaiQC : "2023-10-27T14:00:00Z"
 *                   kodeStokPotongan : "AD-0123-A1"
 *                 - idQC: "bcvc3sASDBV22e-fe64-4343-a275-5b2de4ad8615"
 *                   namaBarang: "Hoodie Green Navy"
 *                   ukuran: "L"
 *                   jumlah: 15
 *                   tanggalSelesaiQC : "2023-10-27T14:00:00Z"
 *                   kodeStokPotongan : "AD-0123-A1"
 *
 */

router.get("/selesai", (req: Request, res: Response) => {
  return res.status(200).json("mikum");
});

/**
 * @swagger
 * /qc/list-pengecek:
 *   get:
 *     summary: Mendapatkan daftar semua user Pengecek QC
 *     tags: [QC]
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan list user
 *         content:
 *           application/json:
 *             example:
 *               - id: "uuid-qc-1"
 *                 nama: "Rian QC"
 */
router.get("/list-pengecek", QCController.getListPengecek);

/**
 * @swagger
 * /qc/list-penanggung-jawab-box:
 *   get:
 *     summary: Mendapatkan daftar semua user Penanggung Jawab Box
 *     tags: [QC]
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan list user
 *         content:
 *           application/json:
 *             example:
 *               - id: "uuid-pj-box-1"
 *                 nama: "Joko PJ Box"
 */
router.get("/list-penanggung-jawab-box", QCController.getListPenanggungJawabBox);



export default router;
