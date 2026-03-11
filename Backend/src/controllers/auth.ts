import { prisma } from "../lib/prisma.js";
import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

interface SignUpBody {
  name: string;
  email: string;
  password: string;
}

/** Generate a secure random refresh token and its expiry (7 days from now) */
function createRefreshToken() {
  const token = crypto.randomBytes(40).toString("hex");
  const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  return { token, expiry };
}

/** Set both auth_token (1h) and refresh_token (7d) cookies */
function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie("auth_token", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 1000, // 1 hour
  });
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

const signUp = asyncHandler(
  async (req: Request<{}, {}, SignUpBody>, res: Response) => {
    try {
      const { email, name, password } = req.body;
      if (!name || !email || !password) {
        res.status(400).json({ msg: "All fields are required" });
        return;
      }
      const userexist = await prisma.user.findUnique({ where: { email } });
      if (userexist) {
        res.status(400).json({ msg: "User already exists" });
        return;
      }

      const hashedPass = await bcrypt.hash(password, 10);
      const { token: refreshToken, expiry: refreshTokenExpiry } = createRefreshToken();

      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPass,
          refreshToken,
          refreshTokenExpiry,
        },
      });

      const jwtsecret = process.env.JWT_SECRET;
      if (!jwtsecret) {
        res.status(500).json({ msg: "JWT secret not configured" });
        return;
      }
      const accessToken = jwt.sign({ id: user.id }, jwtsecret, { expiresIn: "1h" });

      setAuthCookies(res, accessToken, refreshToken);
      res.status(201).json({
        user: { id: user.id, name: user.name, email: user.email },
        msg: "New user created",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

interface SignInBody {
  email: string;
  password: string;
}

const signIn = asyncHandler(
  async (req: Request<{}, {}, SignInBody>, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ msg: "Email and password are required." });
        return;
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ msg: "Invalid credentials" });
        return;
      }

      const jwtsecret = process.env.JWT_SECRET;
      if (!jwtsecret) {
        res.status(500).json({ msg: "JWT secret not configured" });
        return;
      }

      const { token: refreshToken, expiry: refreshTokenExpiry } = createRefreshToken();

      // Rotate refresh token on every login
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken, refreshTokenExpiry },
      });

      const accessToken = jwt.sign({ id: user.id }, jwtsecret, { expiresIn: "1h" });

      setAuthCookies(res, accessToken, refreshToken);
      res.status(200).json({
        msg: "Login successful",
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

/** POST /api/v1/auth/signout — clears both cookies */
const signOut = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("auth_token", { httpOnly: true, sameSite: "strict" });
  res.clearCookie("refresh_token", { httpOnly: true, sameSite: "strict" });
  res.status(200).json({ msg: "Logged out successfully" });
});

/** POST /api/v1/auth/refresh — validates refresh token, issues new access token */
const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refresh_token;
  if (!token) {
    res.status(401).json({ msg: "No refresh token" });
    return;
  }

  const user = await prisma.user.findFirst({ where: { refreshToken: token } });
  if (!user || !user.refreshTokenExpiry || user.refreshTokenExpiry < new Date()) {
    res.clearCookie("auth_token");
    res.clearCookie("refresh_token");
    res.status(401).json({ msg: "Refresh token expired or invalid. Please log in again." });
    return;
  }

  const jwtsecret = process.env.JWT_SECRET;
  if (!jwtsecret) {
    res.status(500).json({ msg: "JWT secret not configured" });
    return;
  }

  // Rotate refresh token (single-use)
  const { token: newRefreshToken, expiry: newRefreshTokenExpiry } = createRefreshToken();
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: newRefreshToken, refreshTokenExpiry: newRefreshTokenExpiry },
  });

  const newAccessToken = jwt.sign({ id: user.id }, jwtsecret, { expiresIn: "1h" });
  setAuthCookies(res, newAccessToken, newRefreshToken);
  res.status(200).json({ msg: "Token refreshed" });
});

export { signUp, signIn, signOut, refresh };
