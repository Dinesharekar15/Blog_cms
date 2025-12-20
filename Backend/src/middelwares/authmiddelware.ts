import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import type { NextFunction, Request,Response } from 'express'


interface CustomRequest extends Request {
  user?: any; // or replace `any` with a specific type (e.g., `User` from Prisma)
}


const authMiddleware =asyncHandler(async(req:CustomRequest,res:Response,next:NextFunction)=>{
    const token =req.cookies.auth_token;
    if (!token) {
     res.status(401).json({ message: 'No token, authorization denied' });
     return
  }
  try {
    const decode =jwt.verify(token,process.env.JWT_SECRET!)
    req.user=decode;
    // console.log(req.user)
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
    return
  }

})

export{authMiddleware }