import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import potongRoutes from "./routes/potongRoutes";
import stokPotongRoutes from "./routes/stokPotongRoutes";
import cookieParser from "cookie-parser";

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

app.get("/", (req, res) => {
  res.json({ message: "Selamat datang di API Alam Jaya Textile" });
});

app.use("/auth", authRoutes);
app.use("/potong", potongRoutes);
app.use("/stokpotong", stokPotongRoutes);

app.listen(port, () => {
  console.log(`Aplikasi berjalan di http://localhost:${port}`);
});
