import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { prisma } from "./lib/prisma.js";
import TrackLog from "./lib/trackLog.js";
import { StatusPermintaan } from "./generated/prisma/browser.js";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

// ==========================
// ES MODULE FIX (__dirname)
// ==========================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==========================
// ROUTES
// ==========================
import authRoutes from "./routes/authRoutes.js";
import potongRoutes from "./routes/potongRoutes.js";
import stokPotongRoutes from "./routes/stokPotongRoutes.js";
import kurirRoutes from "./routes/kurirRoutes.js";
import penjahitRoutes from "./routes/penjahitRoutes.js";
import qcRoutes from "./routes/qcRoutes.js";
import stokGudangRoutes from "./routes/stokGudangRoutes.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
      };
    }
  }
}

// ==========================
const app = express();
const PORT = process.env.PORT || 3001;

// ==========================
// MIDDLEWARE
// ==========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["https://web-alam.vercel.app/", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// ==========================
// SWAGGER FIX FOR VERCEL
// ==========================
const serverUrl =
  process.env.NODE_ENV === "production"
    ? "https://api-alam.vercel.app"
    : "http://localhost:3001";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Alam Jaya Textile API",
      version: "1.0.0",
      description: "REST API Documentation Alam Jaya Textile",
    },
    servers: [
      {
        url: serverUrl,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    // 2. ADD THIS: Apply it globally to all endpoints
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  // Scan hasil build js + source ts
  apis: [
    path.join(__dirname, "./routes/*.js"),
    path.join(__dirname, "./index.js"),
    path.join(__dirname, "../src/routes/*.ts"),
    path.join(__dirname, "../src/index.ts"),
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Debug
// console.log("Swagger Paths:", swaggerSpec.paths);

// Swagger UI Fix Vercel
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.1.1/swagger-ui.css",
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.1.1/swagger-ui-bundle.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.1.1/swagger-ui-standalone-preset.js",
    ],
  }),
);
// app.get("/api-docs", swaggerUi.setup(swaggerSpec));

// JSON Swagger
app.get("/api-docs.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// ==========================
// ROOT
// ==========================
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Selamat datang di API Alam Jaya Textile",
  });
});

// ==========================
// DEBUGGING BACKDOOR
// ==========================

/**
 * @swagger
 * /create/permintaan:
 *   post:
 *     tags:
 *       - Debugging
 *     summary: BACKDOOR Buat Permintaan Gudang
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
 *       200:
 *         description: Berhasil membuat permintaan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: string
 *             example:
 *               message: "Permintaan berhasil dikirimkan ke gudang"
 *               status: "MENUNGGU_GUDANG"
 */

app.post("/create/permintaan", async (req: Request, res: Response) => {
  try {
    const {
      namaBarang,
      kategori,
      jenisPermintaan,
      ukuran,
      isUrgent,
      jumlahMinta,
    } = req.body;

    const kategoriData = await prisma.kategori.findUnique({
      where: {
        slug: kategori,
      },
    });

    if (!kategoriData) {
      return res.status(400).json({
        message: "Kategori tidak ditemukan",
      });
    }

    const newPermintaan = await prisma.permintaan.create({
      data: {
        namaBarang,
        kategoriId: kategoriData.id,
        jenisPermintaan,
        ukuran,
        isUrgent,
        jumlahMinta,
        status: StatusPermintaan.MENUNGGU_GUDANG,
      },
    });

    await TrackLog.logPermintaan(
      newPermintaan.id,
      "Permintaan produk berhasil dibuat",
      StatusPermintaan.MENUNGGU_GUDANG,
    );

    await TrackLog.logStatus(
      newPermintaan.id,
      StatusPermintaan.MENUNGGU_GUDANG,
    );

    return res.json({
      message: "Permintaan produk berhasil dikirim",
      status: StatusPermintaan.MENUNGGU_GUDANG,
      data: newPermintaan,
    });
  } catch (error) {
    console.error("Error create permintaan:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// ==========================
// ROUTES
// ==========================
app.use("/auth", authRoutes);
app.use("/potong", potongRoutes);
app.use("/stokpotong", stokPotongRoutes);
app.use("/kurir", kurirRoutes);
app.use("/penjahit", authMiddleware(["JAHIT"]), penjahitRoutes);
app.use("/qc", qcRoutes);
app.use("/stokgudang", stokGudangRoutes);

// ==========================
// LOCAL SERVER ONLY
// ==========================
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
  });
}

// ==========================
export default app;
