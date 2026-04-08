import { Router } from "express";
import PotongController from "../controller/potongController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Potong
 *   description: Divisi Pemotongan (Menunggu, Proses, Selesai)
 */

/**
 * @swagger
 * /potong/permintaan:
 *   get:
 *     summary: DIVISI POTONG (Tab Menunggu)
 *     tags: [Potong]
 *     responses:
 *       200:
 *         description: Daftar permintaan dari gudang yang menunggu untuk dipotong
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_permintaan:
 *                     type: string
 *                     format: uuid
 *                     example: "38dfdad1-bae0-46ab-906c-beb1f7bf4636"
 *                   namaBarang:
 *                     type: string
 *                     example: "Hoodie Green Navy"
 *                   kategori:
 *                     type: string
 *                     example: "hoodie"
 *                   size:
 *                     type: string
 *                     example: "L"
 *                   isUrgent:
 *                     type: boolean
 *                     example: false
 *                   jumlah_minta:
 *                     type: integer
 *                     example: 20
 *                   tanggalMasukPermintaan:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-01-01T00:00:00.000Z"
 */

router.get("/permintaan", PotongController.getPermintaanProduk);

/**
 * @swagger
 * /potong/permintaan/{id_permintaan}:
 *   put:
 *     summary: DIVISI POTONG (Tab Menunggu - Modal Pindah ke Proses)
 *     description: Memproses permintaan dari gudang
 *     tags: [Potong]
 *     parameters:
 *       - in: path
 *         name: id_permintaan
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil memproses permintaan
 *         content:
 *           application/json:
 *             example:
 *               message: "Permintaan berhasil dipindahkan ke proses"
 *               status: "PROSES_POTONG"
 */
router.put(
  "/permintaan/:id_permintaan",
  PotongController.updatePermintaanProduk,
);

/**
 * @swagger
 * /potong/proses:
 *   get:
 *     summary: DIVISI POTONG (Tab Proses)
 *     tags: [Potong]
 *     responses:
 *       200:
 *         description: Daftar proses permintaan yang sedang dikerjakan untuk di potong
 *         content:
 *           application/json:
 *             example:
 *               - id_permintaan: "38dfdad1-bae0-46ab-906c-beb1f7bf4636"
 *                 namaBarang: "Hoodie Green Navy"
 *                 kategori: "hoodie"
 *                 size: "L"
 *                 isUrgent: false
 *                 jumlah_minta: 20
 *                 tanggalMasukPermintaan: "2023-01-01T00:00:00.000Z"
 *               - id_permintaan: "0c1c31a8-8c3d-4d96-a362-c764698d74b8"
 *                 namaBarang: "Kaos Hitam"
 *                 kategori: "kaos"
 *                 size: "XL"
 *                 isUrgent: true
 *                 jumlah_minta: 40
 *                 tanggalMasukPermintaan: "2025-04-08T00:00:00.000Z"
 */
router.get("/proses", PotongController.getPermintaanProses);

/**
 * @swagger
 * /potong/proses/{id_permintaan}:
 *   put:
 *     summary: Input hasil produksi (Update Proses ke Selesai)
 *     tags: [Potong]
 *     parameters:
 *       - in: path
 *         name: id_permintaan
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kode_kain:
 *                 type: string
 *               pemotong:
 *                 type: string
 *               jumlah_hasil:
 *                 type: integer
 *           example:
 *             kode_kain: "AD-0123"
 *             pemotong: "Budi"
 *             jumlah_hasil: 20
 *     responses:
 *       200:
 *         description: Pekerjaan berhasil diselesaikan
 *         content:
 *           application/json:
 *             example:
 *               message: "Data produksi berhasil diinput dan status selesai"
 */
router.put("/proses/:id_permintaan", PotongController.updatePermintaanProses);

/**
 * @swagger
 * /potong/selesai:
 *   get:
 *     summary: Mendapatkan List Riwayat (Tab Selesai)
 *     tags: [Potong]
 *     responses:
 *       200:
 *         description: Daftar riwayat pekerjaan yang sudah selesai
 *         content:
 *           application/json:
 *             example:
 *               - id_permintaan: 1
 *                 productName: "Hoodie Green Navy"
 *                 size: "L"
 *                 kode_kain: "AD-0123"
 *                 pemotong: "Budi"
 *                 jumlah_hasil: 20
 *                 status: "Selesai"
 */
router.get("/selesai", PotongController.getPermintaanSelesai);

export default router;
