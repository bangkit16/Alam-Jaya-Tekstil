import { Router } from "express";
import StokPotong from "../controller/stokPotongController";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: StokPotong
 *   description: Divisi Stok Potong (Menunggu, Proses, Data Stok , Selesai)
 */

// router.get("/kategori", StokPotong.getKategori);

/**
 * @swagger
 * /stokpotong/menunggu:
 *   get:
 *     summary: Mendapatkan List Potong (Tab Menunggu)
 *     tags: [StokPotong]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               - id_permintaan: "dfc3712e-fe64-4343-a275-5b2de4ad8615"
 *                 namaBarang: "Hoodie Green Navy"
 *                 ukuran: "L"
 *                 kode_kain: "AD-0123"
 *                 pemotong: "Budi"
 *                 jumlah_hasil: 20
 *                 tanggal_selesai_potong: "2023-01-01T00:00:00.000Z"
 *               - id_permintaan: "dfc3712e-fe64-4343-a275-5b2de4kjnnas"
 *                 namaBarang: "Hoodie Black gray"
 *                 ukuran: "L"
 *                 kode_kain: "AD-0125"
 *                 pemotong: "Budi"
 *                 jumlah_hasil: 20
 *                 tanggal_selesai_potong: "2023-01-01T00:00:00.000Z"
 */

router.get("/menunggu", () => {});

/**
 * @swagger
 * /stokpotong/menunggu/{id_stok_potong}:
 *   put:
 *     summary: DIVISI STOK POTONG (Tab Menunggu - Modal Pindah ke Proses - Cek Potong)
 *     description: Memproses permintaan dari stok dan merubah status ke PROSES
 *     tags: [StokPotong]
 *     parameters:
 *       - in: path
 *         name: id_stok_potong
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil memproses permintaan
 *         content:
 *           application/json:
 *             example:
 *               message: "Potong berhasil dipindahkan ke proses"
 *               status: "PROSES_STOK_POTONG"
 */

router.put("/menunggu/:id_stok_potong", () => {});

/**
 * @swagger
 * /stokpotong/proses:
 *   get:
 *     summary: Mendapatkan List Potong (Tab Menunggu)
 *     tags: [StokPotong]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               - id_permintaan: "dfc3712e-fe64-4343-a275-5b2de4ad8615"
 *                 namaBarang: "Hoodie Green Navy"
 *                 ukuran: "L"
 *                 kode_kain: "AD-0123"
 *                 pemotong: "Budi"
 *                 jumlah_hasil: 20
 *                 tanggal_selesai_potong: "2023-01-01T00:00:00.000Z"
 *               - id_permintaan: "dfc3712e-fe64-4343-a275-5b2de4kjnnas"
 *                 namaBarang: "Hoodie Black gray"
 *                 ukuran: "L"
 *                 kode_kain: "AD-0125"
 *                 pemotong: "Budi"
 *                 jumlah_hasil: 20
 *                 tanggal_selesai_potong: "2023-01-01T00:00:00.000Z"
 */

router.get("/proses/", () => {});

/**
 * @swagger
 * /stokpotong/proses/{id_stok_potong}:
 *   put:
 *     summary: Input hasil cek potong (Update Proses ke data stok)
 *     description: Memproes data stok potong dan merubah status menjadi selesai
 *     tags: [StokPotong]
 *     parameters:
 *       - in: path
 *         name: id_stok_potong
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
 *               id_pengecek:
 *                 type: string
 *               kode_stok_potongan:
 *                 type: string
 *               jumlah_potongan_lolos:
 *                 type: integer
 *               jumlah_potongan_reject:
 *                 type: integer
 *               catatan:
 *                 type: string
 *           example:
 *             id_pengecek: "dfcsad2e-fe64-4343-a275-5b2de4ad8615"
 *             kode_stok_potongan: "AD-0123-A1"
 *             jumlah_potongan_lolos: 20
 *             jumlah_potongan_reject: 0
 *             catatan: "Perlu dikembalikan"
 *     responses:
 *       200:
 *         description: Pekerjaan berhasil diselesaikan
 *         content:
 *           application/json:
 *             example:
 *               message: "Permintaan potongan berhasil di proses"
 *               status : "MENUNGGU_KURIR"
 */

router.put("/proses/:id_stok_potong", () => {});

/**
 * @swagger
 * /stokpotong/datastok:
 *   get:
 *     summary: Mendapatkan List Data Stok Potong (Tab Data Stok)
 *     tags: [StokPotong]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               - id_permintaan: "dfc3712e-fe64-4343-a275-5b2de4ad8615"
 *                 id_stok_potong: "bcvc3sad22e-fe64-4343-a275-5b2de4ad8615"
 *                 namaBarang: "Hoodie Green Navy"
 *                 status: "SELESAI"
 *                 ukuran: "L"
 *                 kodeStokPotongan: "AD-0123-A1"
 *                 jumlahLolos: 20
 *                 tanggalMasukPotong: "2023-01-01T00:00:00.000Z"
 *               - id_permintaan: "nhc3712e-fe64-4343-a275-5b2de8615"
 *                 id_stok_potong: "bcvc3sad22e-fe64-4343-a275-5b2de4ad8615"
 *                 namaBarang: "Hoodie Green Navy"
 *                 status: "KIRIM"
 *                 ukuran: "L"
 *                 kodeStokPotongan: "AD-0123-A1"
 *                 jumlahLolos: 20
 *                 tanggalMasukPotong: "2023-01-01T00:00:00.000Z"
 */

router.get("/datastok", () => {});

/**
 * @swagger
 * /stokpotong/datastok/{id_stok_potong}:
 *   put:
 *     summary: DIVISI STOK POTONG (Tab Data Stok - Modal Pindah Kirim ke kurir - Kirim ke Kurir)
 *     description: Memproses data stok potong dari stok potong dikirm ke kurir dan merubah status ke KIRIM dan MENUNGGU_KURIR
 *     tags: [StokPotong]
 *     parameters:
 *       - in: path
 *         name: id_stok_potong
 *         required: false
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_penjahit:
 *                 type: string
 *           example:
 *             id_penjahit: "dfcsad2e-mku1-4343-a275-5b2de4ad8615"
 *     responses:
 *       200:
 *         description: Berhasil memproses permintaan
 *         content:
 *           application/json:
 *             example:
 *               message: "Potong berhasil dipindahkan ke proses"
 *               status: "MENUNGGU_KURIR"
 */

router.put("/datastok/:id_stok_potong", () => {});

/**
 * @swagger
 * /stokpotong/list-pengecek:
 *   get:
 *     summary: Mendapatkan daftar semua user Pengecek
 *     tags: [StokPotong]
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan list user
 *         content:
 *           application/json:
 *             example:
 *               - id: "uuid-pengecek-1"
 *                 nama: "Andi Pengecek"
 */
router.get("/list-pengecek", () => {});

/** 
 * @swagger
 * /stokpotong/list-penjahit:
 *   get:
 *     summary: Mendapatkan daftar semua user Penjahit
 *     tags: [StokPotong]
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan list user
 *         content:
 *           application/json:
 *             example:
 *               - id: "uuid-penjahit-1"
 *                 nama: "Siti Penjahit"
 */
router.get("/list-penjahit", () => {}); 



export default router;
