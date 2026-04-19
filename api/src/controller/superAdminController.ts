import { prisma } from "../lib/prisma.js";
import type { Request, Response } from "express";
import { getPagination, wrapPagination } from "../utils/pagination.js";
// import { Prisma } from "@prisma/client"; // Gunakan client utama
import bcrypt from "bcrypt";
import { Prisma } from "../generated/prisma/browser.js";

export class SuperAdminController {
  // --- READ (GET LIST) ---
  public static async getUser(req: Request, res: Response) {
    try {
      const { prisma: pg, page, limit } = getPagination(req);
      const search = req.query.search as string;

      const whereCondition: Prisma.UserWhereInput = {
        nama: { contains: search, mode: "insensitive" },
      };

      const [user, total] = await Promise.all([
        prisma.user.findMany({
          where: whereCondition,
          ...pg,
          select: {
            id: true,
            nama: true,
            noHandphone: true,
            username: true,
            role: true,
          },
        }),
        prisma.user.count({ where: whereCondition }),
      ]);

      return res.status(200).json({
        data: user,
        meta: wrapPagination(total, page, limit),
        success: true,
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // --- CREATE (POST) ---
  public static async createUser(req: Request, res: Response) {
    try {
      const { nama, noHandphone, username, password, role } = req.body;

      // Cek apakah username sudah ada
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUser)
        return res.status(400).json({ message: "Username sudah digunakan" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: { nama, noHandphone, username, password: hashedPassword, role },
      });

      return res
        .status(201)
        .json({ message: "User berhasil dibuat", data: { id: newUser.id } });
    } catch (error) {
      return res.status(500).json({ message: "Gagal membuat user" });
    }
  }

  // --- UPDATE (PUT) ---
  public static async updateUser(req: Request, res: Response) {
    try {
      const { idUser } = req.params;
      const { nama, noHandphone, role, password } = req.body;

      const dataUpdate: any = { nama, noHandphone, role };

      // Jika password diisi, maka hash ulang
      if (password) {
        dataUpdate.password = await bcrypt.hash(password, 10);
      }

      await prisma.user.update({
        where: { id: String(idUser) },
        data: dataUpdate,
      });

      return res.status(200).json({ message: "User berhasil diperbarui" });
    } catch (error) {
      return res.status(500).json({ message: "Gagal memperbarui user" });
    }
  }

  // --- DELETE (DELETE) ---
  public static async deleteUser(req: Request, res: Response) {
    try {
      const { idUser } = req.params;

      await prisma.user.delete({
        where: { id: String(idUser) },
      });

      return res.status(200).json({ message: "User berhasil dihapus" });
    } catch (error) {
      return res.status(500).json({ message: "Gagal menghapus user" });
    }
  }
}
