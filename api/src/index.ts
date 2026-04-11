import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { prisma } from './lib/prisma';
import TrackLog from './lib/trackLog';
import { StatusPermintaan } from './generated/prisma/browser';

// Route imports
import authRoutes from './routes/authRoutes';
import potongRoutes from './routes/potongRoutes';
import stokPotongRoutes from './routes/stokPotongRoutes';
import kurirRoutes from './routes/kurirRoutes';
import penjahitRoutes from './routes/penjahitRoutes';
import qcRoutes from './routes/qcRoutes';
import stokGudangRoutes from './routes/stokGudangRoutes';

// 1. Load ENV
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();
const PORT = process.env.PORT || 3001;

// 2. Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

// 3. Dynamic Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Alam Jaya Textile API',
      version: '1.0.0',
      description: 'A simple Express API documented with Swagger',
    },
    // Kita kosongkan servers di sini agar diisi secara dinamis oleh middleware
    servers: [],
  },
  apis: ['./src/routes/*.ts', './src/index.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions) as any;

// Middleware untuk menyuntikkan Server URL secara otomatis berdasarkan host saat ini
app.use(
  '/api-docs',
  (req: Request, res: Response, next: NextFunction) => {
    const protocol = req.protocol;
    const host = req.get('host');
    const fullUrl = `${protocol}://${host}`;

    // Update server URL di spek swagger secara dinamis
    swaggerSpec.servers = [{ url: fullUrl }];

    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// 4. Routes
app.get('/', (req, res) => {
  res.json({ message: 'Selamat datang di API Alam Jaya Textile' });
});

// Debugging Backdoor Route
app.post('/create/permintaan', async (req, res) => {
  try {
    const { namaBarang, kategori, jenisPermintaan, ukuran, isUrgent, jumlahMinta } = req.body;
    const kategoriData = await prisma.kategori.findUnique({ where: { slug: kategori } });

    if (!kategoriData) return res.status(400).json({ message: 'Kategori tidak ditemukan' });

    const newPermintaan = await prisma.permintaan.create({
      data: {
        namaBarang,
        kategoriId: kategoriData.id,
        jenisPermintaan,
        ukuran,
        isUrgent,
        jumlahMinta,
        status: 'MENUNGGU_GUDANG',
      },
    });

    await TrackLog.logPermintaan(newPermintaan.id, 'Permintaan produk dibuat', StatusPermintaan.MENUNGGU_GUDANG);
    await TrackLog.logStatus(newPermintaan.id, StatusPermintaan.MENUNGGU_GUDANG);

    return res.json({ message: 'Berhasil', status: StatusPermintaan.MENUNGGU_GUDANG, newPermintaan });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// API Routes
app.use('/auth', authRoutes);
app.use('/potong', potongRoutes);
app.use('/stokpotong', stokPotongRoutes);
app.use('/kurir', kurirRoutes);
app.use('/penjahit', penjahitRoutes);
app.use('/qc', qcRoutes);
app.use('/stokgudang', stokGudangRoutes);

// 5. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📖 Swagger Docs: http://localhost:${PORT}/api-docs`);
});
