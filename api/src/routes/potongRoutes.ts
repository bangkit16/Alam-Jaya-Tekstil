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
 * /potong/menunggu:
 *   get:
 *     summary: DIVISI POTONG (Tab Menunggu)
 *     tags: [Potong]
 *     responses:
 *       200:
 *         description: Daftar menunggu dari gudang yang menunggu untuk dipotong
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idPermintaan:
 *                     type: string
 *                     format: uuid
 *                     example: "38dfdad1-bae0-46ab-906c-beb1f7bf4636"
 *                   namaBarang:
 *                     type: string
 *                     example: "Hoodie Green Navy"
 *                   kategori:
 *                     type: string
 *                     example: "hoodie"
 *                   ukuran:
 *                     type: string
 *                     example: "L"
 *                   isUrgent:
 *                     type: boolean
 *                     example: false
 *                   jumlahMinta:
 *                     type: integer
 *                     example: 20
 *                   tanggalMasukPermintaan:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-01-01T00:00:00.000Z"
 */

router.get("/menunggu", PotongController.getDataMenunggu);

/**
 * @swagger
 * /potong/menunggu/{idPermintaan}:
 *   put:
 *     summary: DIVISI POTONG (Tab Menunggu - Modal Pindah ke Proses)
 *     description: Memproses menunggu dari gudang
 *     tags: [Potong]
 *     parameters:
 *       - in: path
 *         name: idPermintaan
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil memproses menunggu
 *         content:
 *           application/json:
 *             example:
 *               message: "Permintaan berhasil dipindahkan ke proses"
 *               status: "PROSES_POTONG"
 */
router.put("/menunggu/:idPermintaan", PotongController.updateStatusMenunggu);

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
 *               - idPermintaan: "38dfdad1-bae0-46ab-906c-beb1f7bf4636"
 *                 namaBarang: "Hoodie Green Navy"
 *                 kategori: "hoodie"
 *                 ukuran: "L"
 *                 isUrgent: false
 *                 jumlahMinta: 20
 *                 tanggalMasukPermintaan: "2023-01-01T00:00:00.000Z"
 *               - id_permintaan: "0c1c31a8-8c3d-4d96-a362-c764698d74b8"
 *                 namaBarang: "Kaos Hitam"
 *                 kategori: "kaos"
 *                 ukuran: "XL"
 *                 isUrgent: true
 *                 jumlah_minta: 40
 *                 tanggalMasukPermintaan: "2025-04-08T00:00:00.000Z"
 */
router.get("/proses", PotongController.getDataProses);

/**
 * @swagger
 * /potong/proses/{idPermintaan}:
 *   put:
 *     summary: Input hasil produksi (Update Proses ke Selesai)
 *     tags: [Potong]
 *     parameters:
 *       - in: path
 *         name: idPermintaan
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
 *               kodeKain:
 *                 type: string
 *               idPemotong:
 *                 type: string
 *               jumlahHasil:
 *                 type: integer
 *           example:
 *             kodeKain: "AD-0123"
 *             idPemotong:
 *              - "fasdfdfuf-gfwe6256-dashjdb"
 *              - "fasdfdfuf-gfwsad256-dashjdb"
 *             jumlahHasil: 20
 *     responses:
 *       200:
 *         description: Pekerjaan berhasil diselesaikan
 *         content:
 *           application/json:
 *             example:
 *               message: "Permintaan potongan berhasil di proses"
 *               status : "MENUNGGU_STOK_POTONG"
 */

router.put("/proses/:idPermintaan", PotongController.updateStatusProses);

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
 *               - idPermintaan: "dfc3712e-fe64-4343-a275-5b2de4ad8615"
 *                 namaBarang: "Hoodie Green Navy"
 *                 ukuran: "L"
 *                 kodeKain: "AD-0125"
 *                 pemotong:
 *                  - "Budi"
 *                  - "Bani"
 *                 jumlahDiminta: 25
 *                 jumlahHasil: 20
 *               - idPermintaan: "dfc3712e-fe64-4343-a275-5b2de4kjnnas"
 *                 namaBarang: "Hoodie Black gray"
 *                 ukuran: "L"
 *                 kodeKain: "AD-0125"
 *                 pemotong:
 *                  - "Budi"
 *                  - "Bani"
 *                 jumlahDiminta: 25
 *                 jumlahHasil: 20
 */
router.get("/selesai", PotongController.getDataSelesai);

/**
 * @swagger
 * /potong/list-pemotong:
 *   get:
 *     summary: Mendapatkan daftar semua user Pemotong
 *     tags: [Potong]
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan list user
 *         content:
 *           application/json:
 *             example:
 *               - id: "uuid-pemotong-1"
 *                 nama: "Budi Pemotong"
 */
router.get("/list-pemotong", PotongController.getListPemotong);

export default router;
