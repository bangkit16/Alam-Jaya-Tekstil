import { Router } from "express";
import StokPotong from "../controller/kurirController.js";
import KurirController from "../controller/kurirController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Kurir
 *   description: Divisi Kurir (Menunggu, Proses, Selesai)
 */

/**
 * @swagger
 * /kurir/menunggu:
 *   get:
 *     summary: Mendapatkan List Data Menunggu (Tab Menunggu)
 *     tags: [Kurir]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               - idProsesStokPotong: "bcvc3sad22e-fe64-4343-a275-5b2de4ad8615"
 *                 namaBarang: "Hoodie Green Navy"
 *                 ukuran: "L"
 *                 dikirimDari: "STOK POTONG"
 *                 dikirimKe: "Penjahit - Budi"
 *                 isUrgent: false
 *                 kodeStokPotongan: "AD-0123-A1"
 *                 jumlahLolos: 20
 *                 status: "MENUNGGU_PENGIRIMAN"
 *               - idProsesStokPotong: "bcvc3sad22e-fe64-4343-a275-5b2de4ad8615"
 *                 namaBarang: "Hoodie Green Navy"
 *                 ukuran: "L"
 *                 dikirimDari: "Penjahit - Budi"
 *                 dikirimKe: "QC"
 *                 isUrgent: false
 *                 kodeStokPotongan: "AD-5678-A4"
 *                 jumlahLolos: 40
 *                 status: "MENUNGGU_PENGIRIMAN_KE_QC"
 */

router.get("/menunggu", KurirController.getDataMenunggu);

/**
 * @swagger
 * /kurir/menunggu/{idProsesStokPotong}:
 *   put:
 *     summary: Input nama kurir (Update Proses ke data stok)
 *     description: Memproes data stok potong dan merubah status menjadi selesai
 *     tags: [Kurir]
 *     parameters:
 *       - in: path
 *         name: idProsesStokPotong
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idKurir:
 *                 type: string
 *           example:
 *             idKurir: "dfcsad2e-mku1-4343-a275-5b2de4ad8615"
 *     responses:
 *       200:
 *         description: Stok potong sedang dikirimkan
 *         content:
 *           application/json:
 *             example:
 *               message: "Stok potongan berhasil di proses"
 *               status : "PROSES_KURIR"
 */

router.put(
  "/menunggu/:idProsesStokPotong",
  KurirController.updateProsesMenunggu,
);

/**
 * @swagger
 * /kurir/proses:
 *   get:
 *     summary: Mendapatkan List Data Proses (Tab Proses)
 *     tags: [Kurir]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               - idProsesStokPotong: "bcvc3sad22e-fe64-4343-a275-5b2de4ad8615"
 *                 namaBarang: "Hoodie Green Navy"
 *                 ukuran: "L"
 *                 namaPenjahit: "Sari"
 *                 jumlahLolos: 20
 *                 kodeStokPotongan: "AD-0123-A1"
 *                 tanggalBerangkat: "2023-10-27T10:00:00Z"
 *
 */

router.get("/proses", KurirController.getDataProses);

/**
 * @swagger
 * /kurir/proses/{idProsesStokPotong}:
 *   put:
 *     summary: Konfirmasi Selesai Kirim (Update Status ke Selesai)
 *     description: Mengubah status pengiriman dari PROSES_KURIR menjadi SELESAI
 *     tags: [Kurir]
 *     parameters:
 *       - in: path
 *         name: idProsesStokPotong
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pengiriman berhasil diselesaikan
 *         content:
 *           application/json:
 *             example:
 *               message: "Stok potongan telah sampai di tujuan"
 *               status: "MENUNGGU_JAHIT"
 */

router.put("/proses/:idProsesStokPotong", KurirController.updateProsesSelesai);

/**
 * @swagger
 * /kurir/selesai:
 *   get:
 *     summary: Mendapatkan List Data Selesai (Tab Selesai)
 *     tags: [Kurir]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               - idProsesStokPotong: "bcvc3sad22e-fe64-4343-a275-5b2de4ad8615"
 *                 namaBarang: "Hoodie Green Navy"
 *                 ukuran: "L"
 *                 jumlahLolos: 20
 *                 namaPenjahit: "Sari"
 *                 namaKurir: "Agus Kurir"
 *                 isUrgent: true
 *                 kodeStokPotongan: "AD-0123-A1"
 *                 tanggalBerangkat: "2023-10-27T14:00:00Z"
 *                 tanggalSampai: "2023-10-27T14:00:00Z"
 *
 */

router.get("/selesai", KurirController.getDataSelesai);

/**
 * @swagger
 * /kurir/list-kurir:
 *   get:
 *     summary: Mendapatkan daftar semua user Kurir
 *     tags: [Kurir]
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan list user
 *         content:
 *           application/json:
 *             example:
 *               - id: "uuid-kurir-1"
 *                 nama: "Agus Kurir"
 */
router.get("/list-kurir", KurirController.getListKurir);

export default router;
