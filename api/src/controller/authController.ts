import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import * as bcrypt from "bcryptjs";
import AuthService from "../services/authService.js";

const jwtSecret = process.env.JWT_SECRET!;

type UserType = {
  id: string;
  name: string;
  username: string;
  noHandphone: string;
  password: string;
};

function verifyToken(token: string) {
  try {
    return jwt.verify(token, jwtSecret) as { [key: string]: unknown };
  } catch (error) {
    return null;
  }
}

function parseCookies(cookieHeader: string | undefined) {
  return (cookieHeader ?? "")
    .split("; ")
    .reduce<Record<string, string>>((cookies, pair) => {
      const [key, ...rest] = pair.split("=");
      if (key && rest.length > 0) {
        cookies[key] = rest.join("=");
      }
      return cookies;
    }, {});
}

function generateToken(credentials: {
  id: string;
  noHandphone: string;
  username: string;
  nama: string;
  role?: string;
}) {
  const accessToken = jwt.sign(credentials, jwtSecret, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(credentials, jwtSecret, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;

  try {
    if (!username || !password)
      return res
        .status(400)
        .json({ message: "Username and password are required" });

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Inv alid password" });

    const { accessToken, refreshToken } = generateToken({
      id: user.id,
      noHandphone: user.noHandphone || "",
      username,
      nama: user.nama,
      role: user.role,
    });
    // prisma.session.deleteMany({ where: { userId: user.id } });
    // await prisma.session.upsert({
    //   where: { userId: user.id as string },
    //   update: { refreshToken },
    //   create: { refreshToken, userId: user.id },
    // });
    const existingSession = await prisma.session.findFirst({
      where: { userId: user.id },
    });

    if (existingSession) {
      // 2. Jika ada, update berdasarkan ID utamanya
      await prisma.session.update({
        where: { id: existingSession.id },
        data: { refreshToken },
      });
    } else {
      // 3. Jika tidak ada, buat baru
      await prisma.session.create({
        data: { refreshToken, userId: user.id },
      });
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true jika production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken,
      user: {
        id: user.id,
        name: user.nama,
        noHandphone: user.noHandphone,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSession(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken; 

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is missing" });
    }

    const session = await prisma.session.findFirst({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session || !session.user) {
      return res.status(401).json({ message: "Session not found or invalid" });
    }

    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    return res.status(200).json({
      session: {
        id: session.id,
        user: {
          id: session.user.id,
          name: session.user.nama,
          noHandphone: session.user.noHandphone,
          username: session.user.username,
          role: session.user.role,
        },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function logout(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken; 

  // console.log(refreshToken);
  return res.json({ refreshToken });
  
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is missing" });
  }
  const session = await prisma.session.findFirst({ where: { refreshToken } });
  if (!session) {
    return res.status(401).json({ message: "Session not found or invalid" });
  }
  await prisma.session.delete({ where: { id: session.id } });
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
}

export async function refresh(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken; 

    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token" });

    // 1. Cek apakah token ada di Database
    const session = await prisma.session.findFirst({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session) return res.status(403).json({ message: "Session invalid" });

    // 2. Verifikasi JWT
    const decoded = verifyToken(refreshToken) as any;
    if (!decoded)
      return res.status(403).json({ message: "Token expired or invalid" });

    // 3. Generate Access Token Baru (Refresh Token tetap yang lama/bisa dirotasi)
    const newAccessToken = jwt.sign(
      {
        noHandphone: session.user.noHandphone,
        username: session.user.username,
        nama: session.user.nama,
        role: session.user.role,
      },
      jwtSecret,
      { expiresIn: "15m" },
    );

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}