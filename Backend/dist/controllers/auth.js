import { prisma } from "../lib/prisma.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import e from "express";
const signUp = asyncHandler(async (req, res) => {
    try {
        const { email, name, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ msg: "All Fieds are required" });
            return;
        }
        const userexist = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (userexist) {
            res.status(400).json({ msg: "user already exist " });
            return;
        }
        const hashedPass = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email: email,
                name: name,
                password: hashedPass,
            },
        });
        const jwtsecret = process.env.JWT_SECRET;
        if (!jwtsecret) {
            res.status(500).json({ msg: "JWT secrect not configured" });
            return;
        }
        const token = jwt.sign({ id: user.id }, jwtsecret, {
            expiresIn: "1h",
        });
        res.cookie("auth_token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000,
        });
        res.status(201).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal server error" });
        return;
    }
});
const signIn = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ msg: "Email and password are required." });
            return;
        }
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ msg: "Invalid creadentials" });
            return;
        }
        const jwtsecret = process.env.JWT_SECRET;
        if (!jwtsecret) {
            res.status(500).json({ mag: "JWT secreat not configured " });
            return;
        }
        const token = jwt.sign({ id: user.id }, jwtsecret, {
            expiresIn: "1h",
        });
        res.cookie("auth_token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000,
        });
        res.status(201).json({ msg: "login succefully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ mag: "Internal server error" });
        return;
    }
});
export { signUp, signIn };
//# sourceMappingURL=auth.js.map