import { Router } from "express";
import { getSession, login, logout, refresh } from "../controller/authController.js";

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
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             username: "admin"
 *             password: "123"
 *     responses:
 *       200:
 *         description: Berhasil memproses menunggu
 *         content:
 *           application/json:
 *             example:
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsIm5hbWUiOiJBZG1pbiIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTY4ODQyODAwMCwiZXhwIjoxNjg4NDMyNjAwfQ.abc123"
 *               user: 
 *                 id: "123"
 *                 name: "Admin"
 *                 role: "ADMIN"
 *                 username: "admin"
 *                 noHandphone: "08123456789"
 *               
 */
router.post("/login", login);
router.post("/logout", logout);
router.get("/session", getSession);
router.post("/refresh", refresh);

export default router;
