import { Router } from "express";
import type { Request, Response } from "express";
import StokGudangController from "../controller/stokGudangController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: StokGudang
 *   description: Divisi Stok Gudang (Box Masuk, Data Box, Permintaan, Minta Potong, Tracking)
 */

/**
 * @swagger
 * /stokgudang/boxmasuk:
 *   get:
 *     summary: DIVISI Stok Gudang (Tab Box Masuk)
 *     tags: [StokGudang]
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

router.get("/boxmasuk", StokGudangController.getBoxMasuk);

/**
 * @swagger
 * /stokgudang/boxmasuk/{idBox}:
 *   put:
 *     summary: DIVISI Stok Gudang (Tab Box Masuk - Modal Pindah ke Proses - ACC BOX)
 *     tags: [StokGudang]
 *     parameters:
 *       - in: path
 *         name: idBox
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
 *               idPenerimaBox:
 *                 type: string
 *           example:
 *             idPenerimaBox: "dfcsad2e-mku1-4343-a275-5b2de4ad8615"
 *     responses:
 *       200:
 *         description: Stok potong sedang dikirimkan
 *         content:
 *           application/json:
 *             example:
 *               message: "Stok potongan berhasil di proses"
 *               status : "ACC_GUDANG"
 */

router.put("/boxmasuk/:idBox", StokGudangController.updateAccBoxMasuk);

/**
 * @swagger
 * /stokgudang/databox:
 *   get:
 *     summary: DIVISI Stok Gudang (Tab Data Box)
 *     description: Ganti status ACC
 *     tags: [StokGudang]
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             example:
 *               - idBox: "bcvc3sad22e-fe64-4343-a275-5b2de4ad8615"
 *                 namaBox: "Hoodie Green Navy"
 *                 namaPenerimaBox: "Joko"
 *                 kodeBox: "BOX6482416A1"
 *                 tanggalMasukGudang : "2023-10-27T14:00:00Z"
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

router.get("/databox", StokGudangController.getDataBox);

/**
 * @swagger
 * /stokgudang/permintaan:
 *   get:
 *     summary: DIVISI Stok Gudang (Tab Permintaan)
 *     description: Ganti status ACC
 *     tags: [StokGudang]
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
 *                   jenisPermintaan:
 *                     type: string
 *                     example: "RESI"
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

router.get("/permintaan", StokGudangController.getDataPermintaan);

/**
 * @swagger
 * /stokgudang/permintaan/:
 *   post:
 *     summary: DIVISI GUDANG (Tab Permintaan - Modal acc permintaan dari RESI)
 *     tags: [StokGudang]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idPenanggungJawabBox:
 *                  type: string
 *               idBox:
 *                 type: array
 *                 description: Daftar UUID QC yang akan diproses
 *                 items:
 *                   type: string
 *                   format: uuid
 *             example:
 *               idPenanggungJawabBox: "dfcsad2e-mku1-4343-a275-5b2de4ad8615"
 *               idBox:
 *                 - "dfcsad2e-mku1-4343-a275-5b2de4ad8615"
 *                 - "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2g3h4i5j"
 *     responses:
 *       200:
 *         description: Stok potong sedang dikirimkan
 *         content:
 *           application/json:
 *             example:
 *               message: "Stok potongan hasil QC berhasil masuk box"
 *               status: "KIRIM_RESI"
 */

router.post("/permintaan/", () => {});

/**
 * @swagger
 * /stokgudang/permintaan/{idPermintaan}:
 *   put:
 *     summary: DIVISI Stok Gudang (Tab permintaan - Modal MINTA POTONG KE POTONG)
 *     description: Memproses permintaan dari gudang
 *     tags: [StokGudang]
 *     parameters:
 *       - in: path
 *         name: idPermintaan
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Berhasil memproses permintaan
 *         content:
 *           application/json:
 *             example:
 *               message: "Permintaan berhasil dipindahkan ke potong"
 *               status: "MENUNGGU_POTONG"
 */

router.put("/permintaan/:idPermintaan", StokGudangController.updateStatusPermintaan);

/**
 * @swagger
 * /stokgudang/permintaanpotong:
 *   get:
 *     summary: DIVISI Stok Gudang (Tab Minta Potong)
 *     description: Gudang minta potong ke potong
 *     tags: [StokGudang]
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
 *                   jenisPermintaan:
 *                     type: string
 *                     example: "RESI"
 *                   ukuran:
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

router.get("/permintaanpotong", () => {});

/**
 * @swagger
 * /stokgudang/permintaanpotong:
 *   post:
 *     summary: DIVISI Stok Gudang (Tab Minta Potong - Modal Minta Potong)
 *     description: Gudang mengirimkan data permintaan potong
 *     tags: [StokGudang]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               namaBarang:
 *                 type: string
 *               kategori:
 *                 type: string
 *               jenisPermintaan:
 *                 type: string
 *               ukuran:
 *                 type: string
 *               isUrgent:
 *                 type: boolean
 *               jumlah_minta:
 *                 type: integer
 *           example:
 *             namaBarang: "Hoodie Green Navy"
 *             kategori: "hoodie"
 *             jenisPermintaan: "RESI"
 *             ukuran: "L"
 *             isUrgent: false
 *             jumlah_minta: 20
 *     responses:
 *       201:
 *         description: Permintaan potong berhasil dibuat
 *         content:
 *           application/json:
 *             example:
 *               message: "Permintaan potong berhasil dikirim"
 *               status: "MENUNGGU_POTONG"
 */

router.post("/permintaanpotong", (req, res) => {
  // Logic Anda di sini
});

/**
 * @swagger
 * /stokgudang/tracking/{idPermintaan}:
 *   get:
 *     summary: DIVISI Stok Gudang (Tab Tracking )
 *     description: Gudang melihat tracking permintaan
 *     tags: [StokGudang]
 *     parameters:
 *       - in: path
 *         name: idPermintaan
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Daftar tracking
 *         content:
 *           application/json:
 *             example:
 *               - idPermintaan: "38dfdad1-bae0-46ab-906c-beb1f7bf4636"
 *                 namaBarang: "Hoodie Green Navy"
 *                 kategori: "hoodie"
 *                 jenisPermintaan: "RESI"
 *                 ukuran: "L"
 *                 isUrgent: false
 *                 jumlahMinta: 20
 *                 logPermintaan:
 *                   - "Potong sedang di proses"
 *                   - "Potong selesai"
 *                    
 */

router.get("/tracking/:idPermintaan", StokGudangController.getTrackingPermintaan);

/**
 * @swagger
 * /stokgudang/list-penerima-box:
 *   get:
 *     summary: Mendapatkan daftar semua user Penerima Box
 *     tags: [StokGudang]
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan list user
 *         content:
 *           application/json:
 *             example:
 *               - id: "uuid-penerima-1"
 *                 nama: "Dedi Penerima"
 */
router.get("/list-penerima-box", StokGudangController.getListPenerimaBox);

/**
 * @swagger
 * /stokgudang/list-penanggung-jawab-box:
 *   get:
 *     summary: Mendapatkan daftar semua user Penanggung Jawab Box (Gudang)
 *     tags: [StokGudang]
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan list user
 *         content:
 *           application/json:
 *             example:
 *               - id: "uuid-pj-gudang-1"
 *                 nama: "Heri PJ Gudang"
 */
router.get("/list-penanggung-jawab-box", StokGudangController.getListPenanggungJawabBox);


export default router;
