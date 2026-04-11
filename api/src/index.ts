import express from "express";
import cors from "cors";
// import "dotenv/config";
import serverless from "serverless-http";
import authRoutes from "./routes/authRoutes";
import potongRoutes from "./routes/potongRoutes";
import stokPotongRoutes from "./routes/stokPotongRoutes";
import kurirRoutes from "./routes/kurirRoutes";
import penjahitRoutes from "./routes/penjahitRoutes";
import qcRoutes from "./routes/qcRoutes";
import stokGudangRoutes from "./routes/stokGudangRoutes";
import cookieParser from "cookie-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { prisma } from "./lib/prisma";
import TrackLog from "./lib/trackLog";
import { StatusPermintaan } from "./generated/prisma/browser";

// import dotenv from 'dotenv';

// Hanya muat .env jika bukan di production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
const port = 3001;

const router = express.Router();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const urlServerSwagger =
  process.env.NODE_ENV == "production"
    ? "https://alam-jaya-tekstil.onrender.com"
    : "http://localhost:3001";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Alam Jaya Textile API",
      version: "1.0.0",
      description: "A simple Express API documented with Swagger",
    },
    servers: [
      {
        url: urlServerSwagger,
      },
    ],
  },
  // Path to the API docs (files containing @swagger comments)
  apis: ["./src/routes/*.ts", "./src/index.ts"],
};

console.log(urlServerSwagger);

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

router.get("/", (req, res) => {
  res.json({ message: "Selamat datang di API Alam Jaya Textile" });
});

// ======= DEBUGGING backdoor =======

/**
 * @swagger
 * /create/permintaan:
 *   post:
 *     summary: BACKDOOR - Buat Permintaan Ke Gudang (Debugging Endpoint)
 *     description: RESI mengirimkan data permintaan ke GUDANG
 *     tags: [Debugging]
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
 *               jumlahMinta:
 *                 type: integer
 *           example:
 *             namaBarang: "Hoodie Green Navy"
 *             kategori: "hoodie"
 *             jenisPermintaan: "RESI"
 *             ukuran: "L"
 *             isUrgent: false
 *             jumlahMinta: 20
 *     responses:
 *       201:
 *         description: Permintaan produk berhasil dibuat
 *         content:
 *           application/json:
 *             example:
 *               message: "Permintaan produk berhasil dikirim"
 *               status: "MENUNGGU_GUDANG"
 */

router.post("/create/permintaan", async (req, res) => {
  try {
    const {
      namaBarang,
      kategori,
      jenisPermintaan,
      ukuran,
      isUrgent,
      jumlahMinta,
    } = req.body;

    const kategoriId = await prisma.kategori.findUnique({
      where: { slug: kategori },
    });

    if (!kategoriId) {
      return res.status(400).json({ message: "Kategori tidak ditemukan" });
    }

    const newPermintaan = await prisma.permintaan.create({
      data: {
        namaBarang,
        kategoriId: kategoriId?.id, // Gunakan ID kategori yang ditemukan atau fallback ke kategori hoodie
        jenisPermintaan,
        ukuran,
        isUrgent,
        jumlahMinta,
        status: "MENUNGGU_GUDANG",
      },
    });
    await TrackLog.logPermintaan(newPermintaan.id, "Permintaan produk berhasil dibuat", StatusPermintaan.MENUNGGU_GUDANG);
    await TrackLog.logStatus(newPermintaan.id, StatusPermintaan.MENUNGGU_GUDANG);
    return res.json({
      message: "Permintaan produk berhasil dikirim",
      status: StatusPermintaan.MENUNGGU_GUDANG,
      newPermintaan,
    });
  } catch (error) {
    console.error("Error creating permintaan:", error);
    res.status(500).json({ message: "Internal server error" });
  }

  // Di sini Anda bisa menambahkan logika untuk menyimpan data permintaan ke database
});
// ================================

router.use("/auth", authRoutes);
router.use("/potong", potongRoutes);
router.use("/stokpotong", stokPotongRoutes);
router.use("/kurir", kurirRoutes);
router.use("/penjahit", penjahitRoutes);
router.use("/qc", qcRoutes);
router.use("/stokgudang", stokGudangRoutes);

app.use("/.netlify/functions/index", router);

// 4. Kondisikan app.listen (Hanya untuk Lokal)
if (process.env.NODE_ENV !== "production") {
  const port = 3001;
  app.listen(port, () => {
    console.log(`Aplikasi berjalan di http://localhost:${port}`);
  });
}

export const handler = serverless(app);