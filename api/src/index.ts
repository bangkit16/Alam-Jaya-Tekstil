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
import superAdminRoutes from "./routes/superAdminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import potongRoutes from "./routes/potongRoutes.js";
import stokPotongRoutes from "./routes/stokPotongRoutes.js";
import kurirRoutes from "./routes/kurirRoutes.js";
import penjahitRoutes from "./routes/penjahitRoutes.js";
import qcRoutes from "./routes/qcRoutes.js";
import stokGudangRoutes from "./routes/stokGudangRoutes.js";
import stokResiRoutes from "./routes/stokResiRoutes.js";
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

const allowedOrigins = [
  process.env.WEB_URL_PROD,
  "https://web-alam.vercel.app",
  "https://api.alamjaya.tech",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://api-alam.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
// ROUTES
// ==========================
app.use("/admin", authMiddleware(["SUPERADMIN"]), superAdminRoutes);
app.use("/auth", authRoutes);
app.use("/potong", authMiddleware(["POTONG"]), potongRoutes);
app.use("/stokpotong", authMiddleware(["STOK_POTONG"]), stokPotongRoutes);
app.use("/kurir", authMiddleware(["KURIR"]), kurirRoutes);
app.use("/penjahit", authMiddleware(["JAHIT"]), penjahitRoutes);
app.use("/qc", authMiddleware(["QC"]), qcRoutes);
app.use("/stokgudang", authMiddleware(["STOK_GUDANG"]), stokGudangRoutes);
app.use("/stokresi", stokResiRoutes);

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
