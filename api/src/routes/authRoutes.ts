import { Router } from "express";
import { getSession, login, logout } from "../controller/authController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Divisi Pemotongan (Menunggu, Proses, Selesai)
 */

/**
 * @swagger
 * /auth/login:
 *   get:
 *     summary: Login  (Tab Menunggu)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Daftar permintaan dari gudang yang menunggu untuk dipotong
 *         content:
 *           application/json:
 *             example:
 *               - id_permintaan: 1
 *                 productName: "Hoodie Green Navy"
 *                 size: "L"
 *                 quantity: 20
 *                 status: "Menunggu"
 *               - id_permintaan: 2
 *                 productName: "Hoodie Green Navy"
 *                 size: "L"
 *                 quantity: 20
 *                 status: "Menunggu"
 */
router.post("/login", login);
router.post("/logout", logout);
router.get("/session", getSession);

export default router;
