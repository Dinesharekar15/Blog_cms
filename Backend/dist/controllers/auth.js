import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { strict } from "assert";
const prisma = new PrismaClient();
const signUp = asyncHandler(async (req, res) => {
    const { email, name, password } = req.body;
    if (!name || !email || !password) {
        res.json({ msg: "body should not be null" });
        return;
    }
    const userexist = await prisma.user.findFirst({
        where: {
            email: email,
        }
    });
    if (userexist) {
        res.json({ msg: "user already exist " });
        return;
    }
    const hashedPass = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.user.create({
            data: {
                email: email,
                name: name,
                password: hashedPass
            }
        });
        if (!user) {
            res.json({ msg: "somthing went wrong during inserting user " });
            return;
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        res.cookie('auth_token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 3600000
        });
        res.status(200).json({
            user
        });
    }
    catch (error) {
        res.json({ msg: "error during creating new user ", erorr: error });
    }
});
const signIn = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ msg: "Email and password are required." });
        return;
    }
    const user = await prisma.user.findFirst({
        where: {
            email
        }
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ msg: "Invalid creadentials" });
        return;
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    console.log(token);
    res.cookie('auth_token', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 3600000
    });
    res.status(200).json({ msg: "login succefully" });
});
export { signUp, signIn };
//# sourceMappingURL=auth.js.map