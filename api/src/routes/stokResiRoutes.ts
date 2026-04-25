import { Router } from "express";
import type { Request, Response } from "express";
import { StokResiController } from "../controller/stokResiController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: StokResi
 *     description: Management data stok resi dan box masuk
 */

/**
 * @swagger
 * /stokresi/boxmasuk:
 *   get:
 *     summary: Mendapatkan daftar box masuk beserta isi stok potongan
 *     description: Endpoint untuk mengambil data box masuk lengkap dengan daftar stok potongan di dalam box.
 *     tags: [StokResi]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data box masuk
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - idBox: "6cbedb40-d906-4340-ae5c-ae5e7b271739"
 *                   namaBox: "001"
 *                   namaPenanggungJawab: "Sari Wahyuni"
 *                   kodeBox: "BOX-260420-R3AM-40"
 *                   tanggalMasukStok: "2026-04-20T07:12:29.940Z"
 *                   stokPotongan:
 *                     - idQC: "c350cd5a-b093-4ef9-8211-cef030623ff0"
 *                       namaBarang: "Hoodie Putih Merah"
 *                       ukuran: "L"
 *                       jumlah: 0
 *                       tanggalSelesaiQC: "2026-04-20T07:12:04.969Z"
 *                       kodeStokPotongan: "KAINBUS123-123"
 *                       isUrgent: true
 *
 *                 - idBox: "87dde422-d740-4be0-b2b1-d6ce155613fc"
 *                   namaBox: "BOX KAOS DAN SINGLET"
 *                   namaPenanggungJawab: "Sari Wahyuni"
 *                   kodeBox: "BOX-260421-XSER-33"
 *                   tanggalMasukStok: "2026-04-21T04:51:58.533Z"
 *                   stokPotongan:
 *                     - idQC: "349053f5-45a1-49b2-bffe-5eadb004adff"
 *                       namaBarang: "Kaos Branded"
 *                       ukuran: "XL"
 *                       jumlah: 15
 *                       tanggalSelesaiQC: "2026-04-21T04:33:14.538Z"
 *                       kodeStokPotongan: "KOSA90123"
 *                       isUrgent: true
 *                     - idQC: "52ef77bc-c1aa-41b7-9e3c-2f0416832ead"
 *                       namaBarang: "Singlet Yellow Gray"
 *                       ukuran: "XL"
 *                       jumlah: 11
 *                       tanggalSelesaiQC: "2026-04-21T04:34:17.277Z"
 *                       kodeStokPotongan: "ZXC123"
 *                       isUrgent: false
 *
 *                 - idBox: "f4ba745a-f342-4cd2-9a37-ed6569d0be91"
 *                   namaBox: "BOX-HOODIE"
 *                   namaPenanggungJawab: "Sari Wahyuni"
 *                   kodeBox: "BOX-260417-3XI2-01"
 *                   tanggalMasukStok: "2026-04-17T03:37:11.201Z"
 *                   stokPotongan:
 *                     - idQC: "a132a229-d9d6-4df6-94d2-6ec01e8514e7"
 *                       namaBarang: "Hoodie Red"
 *                       ukuran: "M"
 *                       jumlah: 55
 *                       tanggalSelesaiQC: "2026-04-17T03:36:10.361Z"
 *                       kodeStokPotongan: "KAIN123-POLOS"
 *                       isUrgent: true
 *                     - idQC: "d00acf2d-8dd4-4f97-a0c6-44506b5263e0"
 *                       namaBarang: "Hoodie Biru Laut"
 *                       ukuran: "XXL"
 *                       jumlah: 20
 *                       tanggalSelesaiQC: "2026-04-17T03:36:33.420Z"
 *                       kodeStokPotongan: "BMNAS-Hood"
 *                       isUrgent: true
 *
 *               meta:
 *                 totalData: 3
 *                 totalPages: 1
 *                 currentPage: 1
 *                 nextPage: null
 *                 prevPage: null
 *
 *       500:
 *         description: Internal server error
 */

router.get("/boxmasuk", StokResiController.getBoxMasuk);

/**
 * @swagger
 * /stokresi/boxmasuk/{idBox}:
 *   put:
 *     summary: Terima box masuk ke stok resi
 *     description: Endpoint untuk menerima box masuk dan memindahkan data box ke stok resi.
 *     tags: [StokResi]
 *     parameters:
 *       - in: path
 *         name: idBox
 *         required: true
 *         schema:
 *           type: string
 *         description: ID Box yang akan diterima
 *         example: "6cbedb40-d906-4340-ae5c-ae5e7b271739"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idPenerimaBox
 *             properties:
 *               idPenerimaBox:
 *                 type: string
 *                 example: "b12f4e19-29af-4f0a-b9ef-abc123xyz456"
 *           example:
 *             idPenerimaBox: "b12f4e19-29af-4f0a-b9ef-abc123xyz456"
 *     responses:
 *       200:
 *         description: Box berhasil diterima stok resi
 *         content:
 *           application/json:
 *             example:
 *               message: "Box di terima Stok Resi dan masuk data box Stok Resi"
 *               status: "ACC_BOX_STOK_RESI"
 *
 */

router.put("/boxmasuk/:idBox", StokResiController.updateAccBoxMasuk);

/**
 * @swagger
 * /stokresi/databox:
 *   get:
 *     summary: Mendapatkan daftar data box stok resi
 *     description: Endpoint untuk mengambil seluruh data box yang sudah masuk ke stok resi beserta isi stok potongan di dalamnya.
 *     tags: [StokResi]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data box stok resi
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - idBox: "4d1a6d4f-d530-4eba-839e-df690640e8fc"
 *                   namaBox: "BOX123"
 *                   namaPenerimaBox: "Gani Wijaya"
 *                   kodeBox: "BOX-260417-ZLJB-34"
 *                   tanggalMasukGudang: "2026-04-19T09:19:12.759Z"
 *                   stokPotongan:
 *                     - idQC: "a1a21ed9-430c-4962-a6df-c58a90b80389"
 *                       namaBarang: "Singlet Abu"
 *                       ukuran: "XL"
 *                       jumlah: 20
 *                       tanggalSelesaiQC: "2026-04-17T01:50:48.513Z"
 *                       kodeStokPotongan: "ASKI"
 *                       isUrgent: true
 *
 *                 - idBox: "858a8c27-ccfe-45d1-83bf-aa0dd701a764"
 *                   namaBox: "BOX AB"
 *                   namaPenerimaBox: "Fajar Nugraha"
 *                   kodeBox: "BOX-260417-NQWK-12"
 *                   tanggalMasukGudang: "2026-04-17T02:33:17.939Z"
 *                   stokPotongan:
 *                     - idQC: "caafda3e-1462-448b-a527-749c3fed301b"
 *                       namaBarang: "Kaos 3 Second"
 *                       ukuran: "L"
 *                       jumlah: 47
 *                       tanggalSelesaiQC: "2026-04-17T02:32:07.319Z"
 *                       kodeStokPotongan: "A12"
 *                       isUrgent: false
 *
 *                 - idBox: "9080cc32-9a25-4704-a7c2-6f22d05cf71e"
 *                   namaBox: "BOX-001"
 *                   namaPenerimaBox: "Fajar Nugraha"
 *                   kodeBox: "BOX-260416-HM5U-92"
 *                   tanggalMasukGudang: "2026-04-16T03:01:41.958Z"
 *                   stokPotongan:
 *                     - idQC: "63666fd9-2327-4fea-9cfd-bd256e02b4fc"
 *                       namaBarang: "Sweater Merah"
 *                       ukuran: "L"
 *                       jumlah: 5
 *                       tanggalSelesaiQC: "2026-04-16T01:56:36.154Z"
 *                       kodeStokPotongan: "ASD123"
 *                       isUrgent: true
 *                     - idQC: "7a1d4d20-3b94-43ea-b23b-d4bc99cf4753"
 *                       namaBarang: "Hoodie Green Navy"
 *                       ukuran: "L"
 *                       jumlah: 10
 *                       tanggalSelesaiQC: "2026-04-16T01:53:34.293Z"
 *                       kodeStokPotongan: "KODE-POTO"
 *                       isUrgent: false
 *
 *                 - idBox: "9469e3a5-907a-4936-922d-6d17e15de821"
 *                   namaBox: "CobaRafi"
 *                   namaPenerimaBox: "Fajar Nugraha"
 *                   kodeBox: "BOX-260417-5ZUW-31"
 *                   tanggalMasukGudang: "2026-04-18T03:12:13.933Z"
 *                   stokPotongan:
 *                     - idQC: "a30b985f-f444-454e-9100-e64b2769a8f1"
 *                       namaBarang: "Kaos Apollo"
 *                       ukuran: "L"
 *                       jumlah: 40
 *                       tanggalSelesaiQC: "2026-04-17T06:28:36.229Z"
 *                       kodeStokPotongan: "A009-90"
 *                       isUrgent: false
 *
 *                 - idBox: "a9ba8d29-058f-4747-8f04-2711c46dd4a6"
 *                   namaBox: "001"
 *                   namaPenerimaBox: "Gani Wijaya"
 *                   kodeBox: "BOX-260417-WS0U-71"
 *                   tanggalMasukGudang: "2026-04-18T03:19:17.646Z"
 *                   stokPotongan:
 *                     - idQC: "55501bec-e055-4398-80ea-7dedd772dbd8"
 *                       namaBarang: "Kemeja Chinos"
 *                       ukuran: "XXL"
 *                       jumlah: 90
 *                       tanggalSelesaiQC: "2026-04-17T06:08:40.189Z"
 *                       kodeStokPotongan: "CHN-12"
 *                       isUrgent: true
 *
 *                 - idBox: "fbddf906-e7b1-4f0a-90cf-17ea2c4cd5b7"
 *                   namaBox: "Box-00129"
 *                   namaPenerimaBox: "Gani Wijaya"
 *                   kodeBox: "BOX-260416-PXIB-24"
 *                   tanggalMasukGudang: "2026-04-16T05:06:35.822Z"
 *                   stokPotongan:
 *                     - idQC: "1b2ef7a1-febf-4263-a183-8e9e2481b80f"
 *                       namaBarang: "Hoodie Coklat (Coba)"
 *                       ukuran: "L"
 *                       jumlah: 0
 *                       tanggalSelesaiQC: "2026-04-16T05:05:25.757Z"
 *                       kodeStokPotongan: "Ad901"
 *                       isUrgent: true
 *                     - idQC: "1857a001-33b7-4862-b717-4037b1823143"
 *                       namaBarang: "Hoodie Green Navy"
 *                       ukuran: "L"
 *                       jumlah: 16
 *                       tanggalSelesaiQC: "2026-04-16T02:50:41.683Z"
 *                       kodeStokPotongan: "A002"
 *                       isUrgent: false
 *
 *               meta:
 *                 totalData: 6
 *                 totalPages: 1
 *                 currentPage: 1
 *                 nextPage: null
 *                 prevPage: null
 *
 *       500:
 *         description: Internal server error
 */

router.get("/databox", StokResiController.getDataBox);

/**
 * @swagger
 * /stokresi/permintaanproduk:
 *   post:
 *     summary: Membuat permintaan produk ke gudang
 *     description: Endpoint untuk mengirim permintaan produk dari stok resi ke gudang.
 *     tags: [StokResi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - namaBarang
 *               - kategori
 *               - ukuran
 *               - isUrgent
 *               - jumlahMinta
 *             properties:
 *               namaBarang:
 *                 type: string
 *                 example: "Hoodie Green Navy"
 *               kategori:
 *                 type: string
 *                 example: "hoodie"
 *               ukuran:
 *                 type: string
 *                 example: "L"
 *               isUrgent:
 *                 type: boolean
 *                 example: false
 *               jumlahMinta:
 *                 type: integer
 *                 example: 20
 *           example:
 *             namaBarang: "Hoodie Green Navy"
 *             kategori: "hoodie"
 *             ukuran: "L"
 *             isUrgent: false
 *             jumlahMinta: 20
 *     responses:
 *       201:
 *         description: Permintaan produk berhasil dikirim
 *         content:
 *           application/json:
 *             example:
 *               message: "Permintaan proudk berhasil dikirim"
 *               status: "MENUNGGU_GUDANG"
 *
 *       400:
 *         description: Request tidak valid
 *
 *       500:
 *         description: Internal server error
 */

router.post("/permintaanproduk/", StokResiController.createPermintaanProduk);

/**
 * @swagger
 * /stokresi/permintaanproduk:
 *   get:
 *     summary: Mendapatkan daftar permintaan produk stok resi
 *     description: Endpoint untuk mengambil seluruh data permintaan produk yang dibuat dari stok resi.
 *     tags: [StokResi]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data permintaan produk
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - idPermintaan: "38dfdad1-bae0-46ab-906c-beb1f7bf4636"
 *                   namaBarang: "Hoodie Green Navy"
 *                   kategori: "hoodie"
 *                   jenisPermintaan: "RESI"
 *                   ukuran: "L"
 *                   status: "DIPROSES"
 *                   isUrgent: false
 *                   jumlahMinta: 20
 *                   tanggalMasukPermintaan: "2023-01-01T00:00:00.000Z"
 *
 *               meta:
 *                 totalData: 1
 *                 totalPages: 1
 *                 currentPage: 1
 *                 nextPage: null
 *                 prevPage: null
 *
 *       500:
 *         description: Internal server error
 */

router.get("/permintaanproduk/", StokResiController.getListPermintaanProduk);

/**
 * @swagger
 * /stokresi/permintaanproduk/cancel/{idPermintaanProduk}:
 *   put:
 *     summary: Cancel penrmintaan produk berdasarkan ID permintaan produk
 *     description: Endpoint untuk memproses pengiriman pesanan menggunakan data produk yang dipilih.
 *     tags: [StokResi]
 *     parameters:
 *       - in: path
 *         name: idPermintaanProduk
 *         required: true
 *         schema:
 *           type: string
 *         description: ID pesanan
 *         example: "f13e5b1a-7b22-4c9e-bf9f-73d91327aa11"
 *     responses:
 *       200:
 *         description: Pesanan berhasil dikirim
 *         content:
 *           application/json:
 *             example:
 *               message: "Permintaan produk berhasil di batalkan"
 *               status: "PERMINTAAN_PRODUK_DIBATALKAN"

 */

router.put(
  "/permintaanproduk/cancel/:idPermintaanProduk",
  StokResiController.putCancelPermintaanProduk,
);

/**
 * @swagger
 * /stokresi/tracking/{idPermintaan}:
 *   get:
 *     summary: Mendapatkan detail tracking permintaan produk
 *     description: Endpoint untuk melihat status perjalanan permintaan produk berdasarkan ID permintaan.
 *     tags: [StokResi]
 *     parameters:
 *       - in: path
 *         name: idPermintaan
 *         required: true
 *         schema:
 *           type: string
 *         description: ID permintaan produk
 *         example: "07b23186-2457-46d0-9f79-4e664e077af2"
 *     responses:
 *       200:
 *         description: Berhasil mengambil data tracking permintaan
 *         content:
 *           application/json:
 *             example:
 *               idPermintaan: "07b23186-2457-46d0-9f79-4e664e077af2"
 *               namaBarang: "Singlet Biru"
 *               kategori: "Singlet"
 *               jenisPermintaan: "GUDANG"
 *               ukuran: "L"
 *               isUrgent: true
 *               jumlahMinta: 20
 *               tanggalMasukPermintaan: "2026-04-17T08:37:57.462Z"
 *               logPermintaan:
 *                 - tanggal: "17 Apr 2026, 15.37"
 *                   keterangan: "Permintaan potong berhasil dibuat"
 *                   status: "MENUNGGU_POTONG"
 *                 - tanggal: "17 Apr 2026, 15.38"
 *                   keterangan: "Permintaan Potong sedang diproses oleh Divisi Potong"
 *                   status: "PROSES_POTONG"
 *                 - tanggal: "17 Apr 2026, 16.35"
 *                   keterangan: "Pekerjaan potong selesai oleh: Rahmat Hidayat (081300000002). Hasil: 10 pcs."
 *                   status: "MENUNGGU_STOK_POTONG"
 *                 - tanggal: "17 Apr 2026, 16.35"
 *                   keterangan: "Menunggu pengecekan hasil potong di Divisi Stok Potong."
 *                   status: "MENUNGGU_STOK_POTONG"
 *                 - tanggal: "19 Apr 2026, 14.12"
 *                   keterangan: "Stok potong sedang diproses pengecekan oleh Divisi Stok Potong"
 *                   status: "PROSES_STOK_POTONG"
 *                 - tanggal: "21 Apr 2026, 11.58"
 *                   keterangan: "Potongan selesai dicek oleh: Sisil Melati (081400000001), Feri Irawan (081400000002). Lolos: 10 pcs, Reject: 0 pcs."
 *                   status: "MENUNGGU_KURIR"
 *                 - tanggal: "21 Apr 2026, 11.58"
 *                   keterangan: "Potongan Masuk di dalam Data Stok Potongan."
 *                   status: "MENUNGGU_KURIR"
 *                 - tanggal: "21 Apr 2026, 12.00"
 *                   keterangan: "Stok potong sedang menunggu diantar oleh kurir"
 *                   status: "MENUNGGU_KURIR"
 *
 *       404:
 *         description: Data permintaan tidak ditemukan
 *
 *       500:
 *         description: Internal server error
 */

router.get(
  "/tracking/:idPermintaan",
  StokResiController.getTrackingPermintaanProduk,
);

/**
 * @swagger
 * /stokresi/pesanan:
 *   get:
 *     summary: Mendapatkan daftar pesanan stok resi
 *     description: Endpoint untuk mengambil seluruh data pesanan yang masuk ke divisi stok resi.
 *     tags: [StokResi]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data pesanan
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - idPesanan: "f13e5b1a-7b22-4c9e-bf9f-73d91327aa11"
 *                   status: "BELUM_DIKERJAKAN"
 *                   kodeResi: "JSX357325271"
 *                   namaToko: "Fearless Apparel"
 *                   isUrgent: true
 *                   totalDesign: 2
 *                   design:
 *                     - idDesign: "d13e5b1a-7b22-4c9e-bf9f-73d91327aa11"
 *                       namaDesign: "Tengkorak"
 *                       gambarDesign: "http/img/12312"
 *                       kategoriDesign: "hoodie"
 *                       ukuran: "XL"
 *                       jumlah: 1
 *                       produk:
 *                         idProduk: "p13e5b1a-7b22-4c9e-bf9f-73d91327aa11"
 *                         namaProduk: "Hoodie Hitam"
 *                         gambarProduk: "http/img/12312"
 *                         kategoriProduk: "hoodie"
 *                         ukuran: "XL"
 *                         jumlah: 1
 *
 *                     - idDesign: "sv13e5b1a-7b22-4c9e-bf9f-73d91327aa1"
 *                       namaDesign: "Bintang"
 *                       gambarDesign: "http/img/12312"
 *                       kategoriDesign: "hoodie"
 *                       ukuran: "XL"
 *                       jumlah: 1
 *                       produk: {}
 *
 *               meta:
 *                 totalData: 1
 *                 totalPages: 1
 *                 currentPage: 1
 *                 nextPage: null
 *                 prevPage: null
 *
 *       500:
 *         description: Internal server error
 */

router.get("/pesanan", () => {});

/**
 * @swagger
 * /stokresi/pesanan/menunggustok/{idPesanan}:
 *   put:
 *     summary: Ubah status pesanan menjadi menunggu stok
 *     description: Endpoint untuk memproses pesanan menjadi status menunggu stok berdasarkan produk yang dipilih.
 *     tags: [StokResi]
 *     parameters:
 *       - in: path
 *         name: idPesanan
 *         required: true
 *         schema:
 *           type: string
 *         description: ID pesanan
 *         example: "f13e5b1a-7b22-4c9e-bf9f-73d91327aa11"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - idDesign
 *                 - idProduk
 *                 - jumlahProduk
 *               properties:
 *                 idDesign:
 *                   type: string
 *                   example: "dsdhghj-erty123sd-hbavdhj"
 *                 idProduk:
 *                   type: string
 *                   example: "vahgdsfvhgsafd8y-sadasew"
 *                 jumlahProduk:
 *                   type: integer
 *                   example: 2
 *           example:
 *             - idDesign: "dsdhghj-erty123sd-hbavdhj"
 *               idProduk: "vahgdsfvhgsafd8y-sadasew"
 *               jumlahProduk: 2
 *             - idDesign: "zxcasdqwe-123asd-yytr"
 *               idProduk: "produk-9988-abc"
 *               jumlahProduk: 1
 *     responses:
 *       200:
 *         description: Pesanan berhasil diubah menjadi menunggu stok
 *         content:
 *           application/json:
 *             example:
 *               message: "Pesanan sedang menunggu stok"
 *               status: "PESANAN_MENUNGGU_STOK"
 *
 *       400:
 *         description: Request tidak valid
 *
 *       404:
 *         description: Pesanan tidak ditemukan
 *
 *       500:
 *         description: Internal server error
 */

router.put("/pesanan/menunggustok/:idPesanan", () => {});

/**
 * @swagger
 * /stokresi/kirim/{idPesanan}:
 *   put:
 *     summary: Kirim pesanan berdasarkan ID pesanan
 *     description: Endpoint untuk memproses pengiriman pesanan menggunakan data produk yang dipilih.
 *     tags: [StokResi]
 *     parameters:
 *       - in: path
 *         name: idPesanan
 *         required: true
 *         schema:
 *           type: string
 *         description: ID pesanan
 *         example: "f13e5b1a-7b22-4c9e-bf9f-73d91327aa11"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - idDesign
 *                 - idProduk
 *                 - jumlahProduk
 *               properties:
 *                 idDesign:
 *                   type: string
 *                   example: "dsdhghj-erty123sd-hbavdhj"
 *                 idProduk:
 *                   type: string
 *                   example: "vahgdsfvhgsafd8y-sadasew"
 *                 jumlahProduk:
 *                   type: integer
 *                   example: 2
 *           example:
 *             - idDesign: "dsdhghj-erty123sd-hbavdhj"
 *               idProduk: "vahgdsfvhgsafd8y-sadasew"
 *               jumlahProduk: 2
 *             - idDesign: "zxcasdqwe-123asd-yytr"
 *               idProduk: "produk-9988-abc"
 *               jumlahProduk: 1
 *     responses:
 *       200:
 *         description: Pesanan berhasil dikirim
 *         content:
 *           application/json:
 *             example:
 *               message: "Pesanan berhasil dikirim"
 *               status: "PESANAN_DIKIRIM"
 *
 *       400:
 *         description: Request tidak valid
 *
 *       404:
 *         description: Pesanan tidak ditemukan
 *
 *       500:
 *         description: Internal server error
 */

router.put("/pesanan/kirim/:idPesanan", () => {});

/**
 * @swagger
 * /stokresi/riwayatpesanan:
 *   get:
 *     summary: Mendapatkan daftar riwayat pesanan stok resi
 *     description: Endpoint untuk mengambil seluruh data riwayat pesanan yang pernah diproses oleh divisi stok resi.
 *     tags: [StokResi]
 *     responses:
 *       200:
 *         description: Berhasil mengambil data riwayat pesanan
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - idPesanan: "f13e5b1a-7b22-4c9e-bf9f-73d91327aa11"
 *                   kodeResi: "JSX357325271"
 *                   namaToko: "Fearless Apparel"
 *                   isUrgent: true
 *                   totalDesign: 2
 *                   status: "DIKIRIM KE PRESS"
 *                   design:
 *                     - idDesign: "d13e5b1a-7b22-4c9e-bf9f-73d91327aa11"
 *                       namaDesign: "Tengkorak"
 *                       gambarDesign: "http/img/12312"
 *                       kategoriDesign: "hoodie"
 *                       ukuran: "XL"
 *                       jumlah: 1
 *                       produk:
 *                         idProduk: "p13e5b1a-7b22-4c9e-bf9f-73d91327aa11"
 *                         namaProduk: "Hoodie Hitam"
 *                         gambarProduk: "http/img/12312"
 *                         kategoriProduk: "hoodie"
 *                         ukuran: "XL"
 *                         jumlah: 1
 *
 *                     - idDesign: "sv13e5b1a-7b22-4c9e-bf9f-73d91327aa1"
 *                       namaDesign: "Bintang"
 *                       gambarDesign: "http/img/12312"
 *                       kategoriDesign: "hoodie"
 *                       ukuran: "XL"
 *                       jumlah: 1
 *                       produk:
 *                         idProduk: "p13e5b1a-7b22-4c9e-bf9f-73d91327aa11"
 *                         namaProduk: "Hoodie Hitam"
 *                         gambarProduk: "http/img/12312"
 *                         kategoriProduk: "hoodie"
 *                         ukuran: "XL"
 *                         jumlah: 1
 *
 *               meta:
 *                 totalData: 1
 *                 totalPages: 1
 *                 currentPage: 1
 *                 nextPage: null
 *                 prevPage: null
 *
 *       500:
 *         description: Internal server error
 */

router.get("/riwayatpesanan", () => {});

/**
 * @swagger
 * /stokresi/list-penerima-box:
 *   get:
 *     summary: Mendapatkan daftar semua user Penerima Box
 *     tags: [StokResi]
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan list user
 *         content:
 *           application/json:
 *             example:
 *               - id: "uuid-penerima-1"
 *                 nama: "Dedi Penerima"
 */
router.get("/list-penerima-box", StokResiController.getListPenerimaBox);

/**
 * @swagger
 * /stokresi/list-pemroses:
 *   get:
 *     summary: Mendapatkan daftar semua user Penanggung Jawab Box (Gudang)
 *     tags: [StokResi]
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan list user
 *         content:
 *           application/json:
 *             example:
 *               - id: "uuid-pj-gudang-1"
 *                 nama: "Heri PJ Gudang"
 */
router.get("/list-pemroses", StokResiController.getListPemroses);

/**
 * @swagger
 * /stokresi/list-kategori:
 *   get:
 *     summary: Mendapatkan daftar semua kategori
 *     tags: [StokResi]
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan list kategori
 *         content:
 *           application/json:
 *             example:
 *               - id: "uuid-kategori"
 *                 slug: "hoodie"
 *                 nama: "Hoodie"
 */
router.get("/list-kategori", StokResiController.getListKategori);

export default router;
