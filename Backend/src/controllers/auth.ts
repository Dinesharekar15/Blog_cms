import { PrismaClient   } from "@prisma/client";
import asyncHandler from "express-async-handler"
import type { Request,Response } from "express";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
interface SignUpBody {
  name: string;
  email: string;
  password: string;
}

 const prisma=new PrismaClient()
const signUp=asyncHandler(async(req:Request<{},{},SignUpBody>,res:Response)=>{

    const {email,name,password}=req.body;
    if (!name || !email || !password) {
        res.status(400).json({msg:"fill up all field"})
        return;
    }
    const userexist=await prisma.user.findFirst({
        where:{
            email:email,
        }
    })
    if(userexist){
        res.status(400).json({msg:"user already exist "})
        return;
    }

    const hashedPass=await bcrypt.hash(password,10)
    
    try {
        const user=await prisma.user.create({
            data:{
                email:email,
                name:name,
                password:hashedPass
            }
        })
        if(!user){
            res.status(400).json({msg:"somthing went wrong during inserting user "})
            return
        }
        const token =jwt.sign({id:user.id},process.env.JWT_SECRET!,{
            expiresIn:'1h'
        })

        res.cookie('auth_token',token,{
            httpOnly:true,
            sameSite:'strict',
            maxAge:3600000
        })
        res.status(200).json({
            user
        })
    } catch (error) {
        res.json({msg:"error during creating new user ",erorr:error})
    }
})

interface signinbody{
    email:string
    password:string
}

const signIn=asyncHandler(async(req:Request<{},{},signinbody>,res:Response)=>{
    const {email,password}=req.body;

    if(!email || !password){
        res.status(400).json({ msg: "Email and password are required." });
        return
    }
    
  const user = await prisma.user.findFirst({
    where:{
        email
    }
  })
  

  if(!user|| !(await bcrypt.compare(password,user.password))){
     res.status(401).json({msg:"Invalid creadentials"})
     return
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '1h', 
  });
  res.cookie('auth_token',token,{
    httpOnly:true,
    sameSite:'strict',
    maxAge:3600000
  })
  res.status(200).json({msg:"login succefully"})
  
})


export {signUp,signIn}
