import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import cloudinary from "../lib/cloudinary.js";


interface CustomRequest extends Request {
  user?: {
    id: number;
    name?: string;
    email?: string;
  };
  file?:Express.Multer.File|undefined;
}
const creatBlog = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const { title, description } = req.body;
    if (!title) {
      res.status(500).json({ msg: "Title is required" });
      return;
    }
    
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    // console.log("title:",title,"description:",description)
    try {
      let imageUrl:string|null=null;
      if(req.file){
        // console.log('yes')
        const result=await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder:"blogs"
        })
        imageUrl=result.public_id
      }
      const blog = await prisma.blog.create({
        data: {
          title,
          description,
          imageUrl,
          userId,
        },
      });
      res.status(201).json({
        msg: "post created succefully ",
        post: {
          id: blog.id,
          title: blog.title,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ mag: "error at post creation ", err: error });
      return;
    }
  }
);

const allBlogs=asyncHandler(async(req:CustomRequest,res:Response)=>{
  console.log("Dinehs Arekar ")
  
  try {
    const blogs=await prisma.blog.findMany({
      include:{
        user:{
          select:{
            name:true,
            email:true
          }
        }
      }
    })
    res.status(200).json({msg:"All Bogs ",blogs})
    return
  } catch (error:any) {
    console.log(error.msg)
    res.status(500).json({msg:"Internal server error"})
    return
  }
})

export { creatBlog,allBlogs };
