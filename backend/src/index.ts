import express from "express";
import type { Request, Response } from "express";
const app = express();
const port = 3000;

// Definisi route utama
app.get('/', (req:Request, res:Response) => {
  res.json('Hello World!');
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Aplikasi berjalan di http://localhost:${port}`);
});
