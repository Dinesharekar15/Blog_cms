import { prisma } from "../lib/prisma.js";
import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { generateOtp, hashOtp, verifyOtpHash, otpExpiry } from "../lib/otp.js";
import { sendOtpEmail, sendPasswordResetEmail } from "../lib/mailer.js";

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
  const isProduction = process.env.NODE_ENV === "production";
  console.log("NODE_ENV =", process.env.NODE_ENV);
  console.log("isProduction =", isProduction);

  res.cookie("auth_token", accessToken, {
    httpOnly: true,
    // "none" is required for cross-domain requests (frontend & backend on different domains).
    // "none" mandates secure:true, so we always set secure in production.
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 60 * 60 * 1000, // 1 hour
  });
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
}

// ─── Sign Up ────────────────────────────────────────────────────────────────

const signUp = asyncHandler(
  async (req: Request<{}, {}, SignUpBody>, res: Response) => {
    try {
      const { email, name, password } = req.body;
      if (!name || !email || !password) {
        res.status(400).json({ msg: "All fields are required" });
        return;
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        // If user exists but is not verified, resend OTP
        if (!existingUser.isVerified) {
          const otp = generateOtp();
          const hashed = await hashOtp(otp);
          await prisma.user.update({
            where: { email },
            data: { otpHash: hashed, otpExpiry: otpExpiry() },
          });
          await sendOtpEmail(email, otp);
          res.status(200).json({
            msg: "A new OTP has been sent to your email. Please verify.",
            pendingEmail: email,
          });
          return;
        }
        res.status(400).json({ msg: "User already exists" });
        return;
      }

      const hashedPass = await bcrypt.hash(password, 10);
      const otp = generateOtp();
      const hashed = await hashOtp(otp);

      await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPass,
          isVerified: false,
          otpHash: hashed,
          otpExpiry: otpExpiry(),
        },
      });

      await sendOtpEmail(email, otp);

      res.status(201).json({
        msg: "OTP sent to your email. Please verify to complete signup.",
        pendingEmail: email,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

// ─── Verify OTP ─────────────────────────────────────────────────────────────

interface VerifyOtpBody {
  email: string;
  otp: string;
}

const verifyOtp = asyncHandler(
  async (req: Request<{}, {}, VerifyOtpBody>, res: Response) => {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        res.status(400).json({ msg: "Email and OTP are required" });
        return;
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(404).json({ msg: "User not found" });
        return;
      }
      if (user.isVerified) {
        res.status(400).json({ msg: "Email already verified. Please sign in." });
        return;
      }
      if (!user.otpHash || !user.otpExpiry) {
        res.status(400).json({ msg: "No OTP found. Please request a new one." });
        return;
      }
      if (user.otpExpiry < new Date()) {
        res.status(400).json({ msg: "OTP has expired. Please request a new one." });
        return;
      }

      const isValid = await verifyOtpHash(otp, user.otpHash);
      if (!isValid) {
        res.status(400).json({ msg: "Invalid OTP. Please try again." });
        return;
      }

      const jwtsecret = process.env.JWT_SECRET;
      if (!jwtsecret) {
        res.status(500).json({ msg: "JWT secret not configured" });
        return;
      }

      const { token: refreshToken, expiry: refreshTokenExpiry } = createRefreshToken();

      const verifiedUser = await prisma.user.update({
        where: { email },
        data: {
          isVerified: true,
          otpHash: null,
          otpExpiry: null,
          refreshToken,
          refreshTokenExpiry,
        },
      });

      const accessToken = jwt.sign({ id: verifiedUser.id }, jwtsecret, { expiresIn: "1h" });
      setAuthCookies(res, accessToken, refreshToken);

      res.status(200).json({
        msg: "Email verified successfully! Welcome 🎉",
        user: { id: verifiedUser.id, name: verifiedUser.name, email: verifiedUser.email },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

// ─── Resend OTP ─────────────────────────────────────────────────────────────

interface ResendOtpBody {
  email: string;
}

const resendOtp = asyncHandler(
  async (req: Request<{}, {}, ResendOtpBody>, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ msg: "Email is required" });
        return;
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(404).json({ msg: "User not found" });
        return;
      }
      if (user.isVerified) {
        res.status(400).json({ msg: "Email is already verified." });
        return;
      }

      const otp = generateOtp();
      const hashed = await hashOtp(otp);

      await prisma.user.update({
        where: { email },
        data: { otpHash: hashed, otpExpiry: otpExpiry() },
      });

      await sendOtpEmail(email, otp);

      res.status(200).json({ msg: "A new OTP has been sent to your email." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

// ─── Sign In ─────────────────────────────────────────────────────────────────

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

      // Block unverified users — send a new OTP and redirect them
      if (!user.isVerified) {
        const otp = generateOtp();
        const hashed = await hashOtp(otp);
        await prisma.user.update({
          where: { email },
          data: { otpHash: hashed, otpExpiry: otpExpiry() },
        });
        await sendOtpEmail(email, otp);

        res.status(403).json({
          msg: "Email not verified. A new OTP has been sent to your email.",
          needsVerification: true,
          pendingEmail: email,
        });
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

// ─── Sign Out ─────────────────────────────────────────────────────────────────

/** POST /api/v1/auth/signout — clears both cookies */
const signOut = asyncHandler(async (_req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("auth_token", { httpOnly: true, sameSite: isProduction ? "none" : "lax", secure: isProduction });
  res.clearCookie("refresh_token", { httpOnly: true, sameSite: isProduction ? "none" : "lax", secure: isProduction });
  res.status(200).json({ msg: "Logged out successfully" });
});

// ─── Refresh Token ────────────────────────────────────────────────────────────

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

// ─── Forgot Password ─────────────────────────────────────────────────────────

interface ForgotPasswordBody {
  email: string;
}

const forgotPassword = asyncHandler(
  async (req: Request<{}, {}, ForgotPasswordBody>, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ msg: "Email is required" });
        return;
      }

      const user = await prisma.user.findUnique({ where: { email } });

      // Always respond with 200 to prevent email enumeration attacks
      if (!user || !user.isVerified) {
        res.status(200).json({ msg: "If that email exists, a reset code has been sent." });
        return;
      }

      const otp = generateOtp();
      const hashed = await hashOtp(otp);

      await prisma.user.update({
        where: { email },
        data: { otpHash: hashed, otpExpiry: otpExpiry() },
      });

      await sendPasswordResetEmail(email, otp);

      res.status(200).json({ msg: "If that email exists, a reset code has been sent.", pendingEmail: email });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

// ─── Reset Password ───────────────────────────────────────────────────────────

interface ResetPasswordBody {
  email: string;
  otp: string;
  newPassword: string;
}

const resetPassword = asyncHandler(
  async (req: Request<{}, {}, ResetPasswordBody>, res: Response) => {
    try {
      const { email, otp, newPassword } = req.body;
      if (!email || !otp || !newPassword) {
        res.status(400).json({ msg: "Email, OTP, and new password are required" });
        return;
      }
      if (newPassword.length < 6) {
        res.status(400).json({ msg: "Password must be at least 6 characters" });
        return;
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(404).json({ msg: "User not found" });
        return;
      }
      if (!user.otpHash || !user.otpExpiry) {
        res.status(400).json({ msg: "No reset code found. Please request a new one." });
        return;
      }
      if (user.otpExpiry < new Date()) {
        res.status(400).json({ msg: "Reset code has expired. Please request a new one." });
        return;
      }

      const isValid = await verifyOtpHash(otp, user.otpHash);
      if (!isValid) {
        res.status(400).json({ msg: "Invalid reset code. Please try again." });
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          otpHash: null,
          otpExpiry: null,
        },
      });

      res.status(200).json({ msg: "Password reset successfully. Please sign in." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Internal server error" });
    }
  }
);

export { signUp, signIn, signOut, refresh, verifyOtp, resendOtp, forgotPassword, resetPassword };
