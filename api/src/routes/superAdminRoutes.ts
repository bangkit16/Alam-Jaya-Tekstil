import { Router } from "express";
import {
  getSession,
  login,
  logout,
  refresh,
} from "../controller/authController.js";
import { SuperAdminController } from "../controller/superAdminController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: SuperAdmin
 *   description: SuperADMIN
 */

/**
 * @swagger
 * /admin/list-user:
 *   get:
 *     summary: Mendapatkan daftar user
 *     tags: [SuperAdmin]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Jumlah data per halaman
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Cari berdasarkan nama atau username
 *     responses:
 *       200:
 *         description: Berhasil mengambil daftar user
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - idUser: "74a9148c-2b2c-48b5-8f0e-1261e19eb337"
 *                   nama: "Siti Aminah"
 *                   noHandphone: "081234567890"
 *                   username: "sitiaminah"
 *                   role: "POTONG"
 *                 - idUser: "e906dc20-e83d-4250-8c4e-17f850135b2b"
 *                   nama: "Rahmat Hidayat"
 *                   noHandphone: "081299887766"
 *                   username: "rahmath"
 *                   role: "POTONG"
 *                 - idUser: "07b23186-2457-46d0-9f79-4e664e077af2"
 *                   nama: "Budi Santoso"
 *                   noHandphone: "085711223344"
 *                   username: "budisant"
 *                   role: "ADMIN"
 *                 - idUser: "5afcdb55-45ed-4758-b7fd-53decdcc26a3"
 *                   nama: "Agus Setiawan"
 *                   noHandphone: "089944556677"
 *                   username: "agus_set"
 *                   role: "POTONG"
 *                 - idUser: "b672b889-65c3-4b47-b537-89c149f1d8bf"
 *                   nama: "Dewi Lestari"
 *                   noHandphone: "081388772211"
 *                   username: "dewiles"
 *                   role: "SUPERADMIN"
 *               meta:
 *                 totalData: 16
 *                 totalPages: 2
 *                 currentPage: 2
 *                 nextPage: null
 *                 prevPage: 1
 */

router.get("/list-user", SuperAdminController.getUser);

/**
 * @swagger
 * /admin/add-user:
 *   post:
 *     summary: Menambahkan user baru
 *     tags: [SuperAdmin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama
 *               - noHandphone
 *               - username
 *               - password
 *               - role
 *             properties:
 *               nama:
 *                 type: string
 *                 example: "Ahmad Subarjo"
 *               noHandphone:
 *                 type: string
 *                 example: "08123456789"
 *               username:
 *                 type: string
 *                 example: "ahmad_s"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "rahasia123"
 *               role:
 *                 type: string
 *                 enum: [SUPERADMIN, ADMIN, POTONG]
 *                 example: "POTONG"
 *     responses:
 *       201:
 *         description: User berhasil dibuat
 *         content:
 *           application/json:
 *             example:
 *               message: "User berhasil ditambahkan"
 *               data:
 *                 idUser: "f2a3b4c5-d6e7-4890-a1b2-c3d4e5f6g7h8"
 *                 nama: "Ahmad Subarjo"
 *                 role: "POTONG"
 *       
 */

router.post("/add-user", SuperAdminController.createUser);

/**
 * @swagger
 * /admin/edit-user/{idUser}:
 *   put:
 *     summary: Mengubah data user
 *     tags: [SuperAdmin]
 *     parameters:
 *       - in: path
 *         name: idUser
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unik user yang ingin diedit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *                 example: "Rahmat Hidayat Edit"
 *               noHandphone:
 *                 type: string
 *                 example: "089911223344"
 *               role:
 *                 type: string
 *                 enum: [SUPERADMIN, ADMIN, POTONG]
 *                 example: "POTONG"
 *     responses:
 *       200:
 *         description: Data user berhasil diperbarui
 *         content:
 *           application/json:
 *             example:
 *               message: "User berhasil diperbarui"
 *
 * /admin/delete-user/{idUser}:
 *   delete:
 *     summary: Menghapus user
 *     tags: [SuperAdmin]
 *     parameters:
 *       - in: path
 *         name: idUser
 *         required: true
 *         schema:
 *           type: string
 *         description: ID unik user yang ingin dihapus
 *     responses:
 *       200:
 *         description: User berhasil dihapus
 *         content:
 *           application/json:
 *             example:
 *               message: "User dengan ID tersebut telah dihapus"
 *       404:
 *         description: User tidak ditemukan
 */

router.put("/edit-user/:idUser", SuperAdminController.updateUser);
router.delete("/delete-user/:idUser", SuperAdminController.deleteUser);

/**
 * @swagger
 * /admin/role:
 *   get:
 *     summary: Mendapatkan daftar semua Role
 *     tags: [SuperAdmin]
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan list role
 *         content:
 *           application/json:
 *             example:
 *               - id: "KURIR"
 *                 namaRole: "KURIR"
 */
// router.get("/role", SuperAdminController.getListRoles);

export default router;
