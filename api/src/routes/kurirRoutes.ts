import { Router } from "express";
import StokPotong from "../controller/stokPotongController";

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
 *               - id_proses_stok_potong: "bcvc3sad22e-fe64-4343-a275-5b2de4ad8615"
 *                 namaBarang: "Hoodie Green Navy"
 *                 ukuran: "L"
 *                 namaPenjahit: "Sari"
 *                 kodeStokPotongan: "AD-0123-A1"
 *                 jumlahLolos: 20
 *               - id_proses_stok_potong: "bcvc3sad22e-fe64-4343-a275-5b2de4ad8615"
 *                 namaBarang: "Hoodie Green Navy"
 *                 ukuran: "L"
 *                 namaPenjahit: "Roti"
 *                 kodeStokPotongan: "AD-5678-A4"
 *                 jumlahLolos: 40
 */

router.get("/menunggu" , () => {});

/**
 * @swagger
 * /kurir/menunggu/{id_proses_stok_potong}:
 *   put:
 *     summary: Input nama kurir (Update Proses ke data stok)
 *     description: Memproes data stok potong dan merubah status menjadi selesai
 *     tags: [Kurir]
 *     parameters:
 *       - in: path
 *         name: id_proses_stok_potong
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
 *               id_kurir:
 *                 type: string
 *           example:
 *             id_kurir: "dfcsad2e-mku1-4343-a275-5b2de4ad8615"
 *     responses:
 *       200:
 *         description: Stok potong sedang dikirimkan
 *         content:
 *           application/json:
 *             example:
 *               message: "Stok potongan berhasil di proses"
 *               status : "PROSES_KURIR"
 */


router.put("/menunggu/id_stok_potong", () => {});

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
 *               - id_proses_stok_potong: "bcvc3sad22e-fe64-4343-a275-5b2de4ad8615"
 *                 namaBarang: "Hoodie Green Navy"
 *                 ukuran: "L"
 *                 namaPenjahit: "Sari"
 *                 jumlahLolos: 20
 *                 kodeStokPotongan: "AD-0123-A1"
 *                 tanggalBerangkat: "2023-10-27T10:00:00Z"
 * 
 */

 router.get("/proses", () => {});

 /**
 * @swagger
 * /kurir/proses/{id_proses_stok_potong}:
 *   put:
 *     summary: Konfirmasi Selesai Kirim (Update Status ke Selesai)
 *     description: Mengubah status pengiriman dari PROSES_KURIR menjadi SELESAI
 *     tags: [Kurir]
 *     parameters:
 *       - in: path
 *         name: id_proses_stok_potong
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
 *               status: "SELESAI"
 */

router.put("/proses/:id_proses_stok_potong", () => {});

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
 *               - id_proses_stok_potong: "bcvc3sad22e-fe64-4343-a275-5b2de4ad8615"
 *                 namaBarang: "Hoodie Green Navy"
 *                 ukuran: "L"
 *                 jumlahLolos: 20
 *                 namaPenjahit: "Sari"
 *                 kodeStokPotongan: "AD-0123-A1"
 *                 tanggalSampai: "2023-10-27T14:00:00Z"
 * 
 */


router.get("/selesai", () => {});





export default router;