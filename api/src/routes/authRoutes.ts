import { Router } from "express";
import { getSession, login, logout } from "../controller/authController";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/session", getSession);

export default router;
