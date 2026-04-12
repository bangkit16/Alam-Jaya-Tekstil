import { Router } from "express";
import StokPotongController from "../controller/stokPotongController.js";

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
 *               - idPermintaan: "dfc3712e-fe64-4343-a275-5b2de4ad8615"
 *                 idStokPotong: "dfFDSHFSUDI712e-fe64-4343-a275-5b2de4ad8615"
 *                 namaBarang: "Hoodie Green Navy"
 *                 ukuran: "L"
 *                 kodeKain: "AD-0123"
 *                 pemotong: "Budi"
 *                 jumlahHasil: 20
 *                 tanggalSelesaiPotong: "2023-01-01T00:00:00.000Z"
 *               - idPermintaan: "dfc3712e-fe64-4343-a275-5b2de4kjnnas"
 *                 idStokPotong: "MBNJKYTU12e-fe64-4343-a275-5b2de4ad8615"
 *                 namaBarang: "Hoodie Black gray"
 *                 ukuran: "L"
 *                 kodeKain: "AD-0125"
 *                 pemotong: "Budi"
 *                 jumlahHasil: 20
 *                 tanggalSelesaiPotong: "2023-01-01T00:00:00.000Z"
 */

router.get("/menunggu", StokPotongController.getDataMenunggu);

/**
 * @swagger
 * /stokpotong/menunggu/{idStokPotong}:
 *   put:
 *     summary: DIVISI STOK POTONG (Tab Menunggu - Modal Pindah ke Proses - Cek Potong)
 *     description: Memproses permintaan dari stok dan merubah status ke PROSES
 *     tags: [StokPotong]
 *     parameters:
 *       - in: path
 *         name: idStokPotong
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil memproses permintaan
 *         content:
 *           application/json:
 *             example:
 *               message: "Potong sedang diproses pengecekan oleh divisi Stok Potong"
 *               status: "PROSES_STOK_POTONG"
 */

router.put(
  "/menunggu/:idStokPotong",
  StokPotongController.updateStatusMenunggu,
);

/**
 * @swagger
 * /stokpotong/proses:
 *   get:
 *     summary: Mendapatkan List Potong (Tab Proses)
 *     tags: [StokPotong]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               - idPermintaan: "dfc3712e-fe64-4343-a275-5b2de4ad8615"
 *                 idStokPotong: "dfFDSHFSUDI712e-fe64-4343-a275-5b2de4ad8615"              
 *                 namaBarang: "Hoodie Green Navy"
 *                 ukuran: "L"
 *                 kodeKain: "AD-0123"
 *                 pemotong: "Budi"
 *                 jumlahHasil: 20
 *                 tanggalSelesaiPotong: "2023-01-01T00:00:00.000Z"
 *               - idPermintaan: "dfc3712e-fe64-4343-a275-5b2de4kjnnas"
 *                 idStokPotong: "dfFDSHFSUDADe-fe64-4343-a275-5b2de4ad8615"   
 *                 namaBarang: "Hoodie Black gray"
 *                 ukuran: "L"
 *                 kodeKain: "AD-0125"
 *                 pemotong: "Budi"
 *                 jumlahHasil: 20
 *                 tanggalSelesaiPotong: "2023-01-01T00:00:00.000Z"
 */

router.get("/proses/", StokPotongController.getDataProses);

/**
 * @swagger
 * /stokpotong/proses/{idStokPotong}:
 *   put:
 *     summary: Input hasil cek potong (Update Proses ke data stok)
 *     description: Memproes data stok potong dan merubah status menjadi selesai
 *     tags: [StokPotong]
 *     parameters:
 *       - in: path
 *         name: idStokPotong
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
 *               idPengecek:
 *                 type: string
 *               kodeStokPotongan:
 *                 type: string
 *               jumlahPotonganLolos:
 *                 type: integer
 *               jumlahPotonganReject:
 *                 type: integer
 *               catatan:
 *                 type: string
 *           example:
 *             idPengecek: 
 *             - "dfcsad2e-fe64-4343-a275-5b2de4ad8615"
 *             - "kjhgrfgb-fe64-4343-a275-5b2de4ad8615"
 *             kodeStokPotongan: "AD-0123-A1"
 *             jumlahPotonganLolos: 20
 *             jumlahPotonganReject: 0
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

router.put("/proses/:idStokPotong", StokPotongController.updateStatusProses);

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
 *               - idPermintaan: "dfc3712e-fe64-4343-a275-5b2de4ad8615"
 *                 idStokPotong: "bcvc3sad22e-fe64-4343-a275-5b2de4ad8615"
 *                 namaBarang: "Hoodie Green Navy"
 *                 status: "SELESAI"
 *                 ukuran: "L"
 *                 kodeStokPotongan: "AD-0123-A1"
 *                 jumlahLolos: 20
 *                 tanggalMasukPotong: "2023-01-01T00:00:00.000Z"
 *               - idPermintaan: "nhc3712e-fe64-4343-a275-5b2de8615"
 *                 idStokPotong: "bcvc3sad22e-fe64-4343-a275-5b2de4ad8615"
 *                 namaBarang: "Hoodie Green Navy"
 *                 status: "KIRIM"
 *                 ukuran: "L"
 *                 kodeStokPotongan: "AD-0123-A1"
 *                 jumlahLolos: 20
 *                 tanggalMasukPotong: "2023-01-01T00:00:00.000Z"
 */

router.get("/datastok", StokPotongController.getDataStok);

/**
 * @swagger
 * /stokpotong/datastok/{idStokPotong}:
 *   put:
 *     summary: DIVISI STOK POTONG (Tab Data Stok - Modal Pindah Kirim ke kurir - Kirim ke Kurir)
 *     description: Memproses data stok potong dari stok potong dikirm ke kurir dan merubah status ke KIRIM dan MENUNGGU_KURIR
 *     tags: [StokPotong]
 *     parameters:
 *       - in: path
 *         name: idStokPotong
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
 *               idPenjahit:
 *                 type: string
 *           example:
 *             idPenjahit: "dfcsad2e-mku1-4343-a275-5b2de4ad8615"
 *     responses:
 *       200:
 *         description: Berhasil memproses permintaan
 *         content:
 *           application/json:
 *             example:
 *               message: "Potong sedang menunggu kurir untuk diambil"
 *               status: "MENUNGGU_KURIR"
 */

router.put("/datastok/:idStokPotong", StokPotongController.updateStatusKirim);

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
router.get("/list-pengecek", StokPotongController.getListPengecek);

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
router.get("/list-penjahit", StokPotongController.getListPenjahit);

export default router;
