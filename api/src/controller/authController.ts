import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import * as bcrypt from "bcryptjs";
import AuthService from "../services/authService";

const jwtSecret = process.env.JWT_SECRET!;

type UserType = {
  id: string;
  name: string;
  username: string;
  email: string;
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
  email: string;
  username: string;
  name: string;
  role?: string;
}) {
  const accessToken = jwt.sign(credentials, jwtSecret, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(credentials, jwtSecret, {
    expiresIn: "5h",
  });
  return { accessToken, refreshToken };
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body as Pick<
    UserType,
    "username" | "password"
  >;

  try {
    if (username == null || password == null)
      return res
        .status(400)
        .json({ message: "username and password are required" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare plain text password with hashed password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid password" });

    const { accessToken, refreshToken } = generateToken({
      email: user.email,
      username,
      name: user.name,
      role: user.role,
    });

    const session = await prisma.session.findUnique({
      where: { userId: user.id },
    });
    if (session) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    await prisma.session.create({
      data: {
        refreshToken,
        userId: user.id,
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({ accessToken, role: user.role });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSession(req: Request, res: Response) {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const refreshToken = cookies.refreshToken;

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
          name: session.user.name,
          email: session.user.email,
          username: session.user.username,
          role: session.user.role,
        },
        createdAt: session.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function logout(req: Request, res: Response) {
  const cookies = parseCookies(req.headers.cookie);
  const refreshToken = cookies.refreshToken;
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
