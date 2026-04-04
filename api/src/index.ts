import express from "express";
import cors from "cors";
import postRoutes from "./routes/postRoutes";
import cookieParser from "cookie-parser";
import { getSession, login, logout } from "./controller/authController";

const app = express();
const port = 3001;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Selamat datang di Api Alam Jaya Textile" });
});

app.post("/auth/login", login);
app.post("/auth/logout", logout);
app.get("/auth/session", getSession);

// app.use(postRoutes);

app.listen(port, () => {
  console.log(`Aplikasi berjalan di http://localhost:${port}`);
});
