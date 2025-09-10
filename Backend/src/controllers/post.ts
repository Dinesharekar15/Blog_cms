import asyncHandler from 'express-async-handler'
import type { Request,Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma=new PrismaClient()
interface BlogContent{
    title:string
    description :string
    imageUrl : string|null
    videoUrl :string|null
    userId:number
}
interface CustomRequestWithBody<T> extends Request<{},{},T>{
  user?:{
    id:number,
    email?:string
  }
}
const creatPost=asyncHandler(async(req:CustomRequestWithBody<BlogContent>,res:Response)=>{
    const {title,description,imageUrl,videoUrl}=req.body;
    const userId=req.user?.id;
     if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
    }
    try {
         const post = await prisma.blog.create({
      data: {
        title,
        description,
        imageUrl,
        videoUrl,
        userId,
      },
    });
         if(!post){
            res.json({msg:"Post creation failed "})
            return
         }
         res.json({msg:"post created succefully " ,post})
    } catch (error) {
        res.json({mag:"error at post creation ",err:error})
        return
    }

   
    
})


const allposts=asyncHandler(async(req:Request,res:Response)=>{
    const posts=await prisma.blog.findMany({})
    res.status(200).json({posts})
})


export{allposts,creatPost}