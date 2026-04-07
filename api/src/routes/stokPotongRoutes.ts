import { Router } from "express";
import StokPotong from "../controller/stokPotongController";

const router = Router();

router.get("/kategori", StokPotong.getKategori);
router.get("/stok/:slug", StokPotong.getStokPotong);
router.put("/pengecekan/:id_stok_potong", StokPotong.putStokPotong);
router.get("/pengecekan", StokPotong.getStokProsesPengecekan);

export default router;
