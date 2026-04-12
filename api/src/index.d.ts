import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      // Ganti 'any' dengan interface User kamu jika ada
      user?: { id: string };
    }
  }
}
