import { Router } from "express";
import PotongController from "../controller/potongController";

const router = Router();

router.get("/permintaan", PotongController.getPermintaanProduk);
router.put("/permintaan/:id_permintaan", PotongController.updatePermintaanProduk);
router.get("/proses", PotongController.getPermintaanProses);
router.put("/proses/:id_permintaan", PotongController.updatePermintaanProses);
router.get("/selesai", PotongController.getPermintaanSelesai);

export default router;
