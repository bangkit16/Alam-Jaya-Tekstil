import { Router } from "express";
import PotongController from "../controller/potongController";

const router = Router();

router.get("/kategori", PotongController.getKategori);
router.get("/permintaan", PotongController.getPermintaanProduk);
router.put("/permintaan/:id_permintaan", PotongController.updatePermintaanProduk);
router.get("/proses", PotongController.getPermintaanProses);
router.put("/proses/:id_permintaan", PotongController.updatePermintaanProses);
router.get("/stokpotong/:slug", PotongController.getStokPotong);
router.put("/stokpotong/:id_stok_potong", PotongController.putStokPotong);
router.get("/stokkirim", PotongController.getStokKirim);

export default router;
