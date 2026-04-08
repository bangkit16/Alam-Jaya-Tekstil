import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import potongRoutes from "./routes/potongRoutes";
import stokPotongRoutes from "./routes/stokPotongRoutes";
import cookieParser from "cookie-parser";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const port = 3001;

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
        url: "http://localhost:3001",
      },
    ],
  },
  // Path to the API docs (files containing @swagger comments)
  apis: ["./src/routes/*.ts", "./src/index.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({ message: "Selamat datang di API Alam Jaya Textile" });
});


app.use("/auth", authRoutes);
app.use("/potong", potongRoutes);
app.use("/stokpotong", stokPotongRoutes);

app.listen(port, () => {
  console.log(`Aplikasi berjalan di http://localhost:${port}`);
});
