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
  const userId=Number(req.user?.id)
  try {
    const blogs=await prisma.blog.findMany({
      include:{
        user:{
          select:{
            name:true,
            email:true
          }
        },
        _count:{select:{like:true,comment:true}},
        like:userId?{where:{userId}}:false
      },
      orderBy: {
        createdAt: "desc",
      }
    })
    const formattedBlog=blogs.map((blog)=>({
      ...blog,
      like:blog._count.like,
      comment:blog._count.comment,
      isLiked:blog.like?.length>0
    }))
    res.status(200).json({msg:"All Bogs ",formattedBlog})
    return
  } catch (error:any) {
    console.log(error.msg)
    res.status(500).json({msg:"Internal server error"})
    return
  }
})

const likeBlog=async(req:CustomRequest,res:Response)=>{
    const blogId=Number(req.params.blogId)
    const userId=Number(req.user?.id)
  try {
    const blog=await prisma.like.findMany({
      where:{
        userId,
        blogId
      }
    })
    if(blog.length>0){
      res.status(400).json({msg:"Post allready liked"})
      return
    }
    await prisma.like.create({
      data:{
        userId,
        blogId
      }
    })
    const likecounts=await prisma.like.count({
      where:{
        blogId
      }
    })
    res.status(200).json({
      msg:"Blog Liked",
      likecounts
    })
  } catch (error:any) {
    console.log(error.msg)
    res.status(500).json({msg:"Like failed"})
    return
  }
}

const unlikeBlog=async(req:CustomRequest,res:Response)=>{
  const userId=Number(req.user?.id);
  const blogId=Number(req.params.blogId)
  try {
    await prisma.like.deleteMany({
      where:{
        userId,
        blogId
      }
    })
    res.status(200).json({msg:"Like Removed "})
  } catch (error:any) {
    console.log(error.msg)
    res.status(500).json({msg:"Error :",error})
  }
}

const addComment=async(req:CustomRequest,res:Response)=>{
    const userId=Number(req.user?.id)
    const blogId=Number(req.params.blogId)
    const {content,parentId}=req.body
    try {
      const comment =await prisma.comment.create({
        data:{
          content,
          userId,
          blogId,
          parentId:parentId||null
        },
        include:{
          user:{
            select:{id:true,name:true}
          }
        }
      })
      res.status(201).json({msg:"Comment Added",comment:comment})
    } catch (error:any) {
      console.log(error.msg)
      res.status(500).json({msg:"Fail to add comment"})
    }
}

const allComment=async (req:CustomRequest,res:Response)=>{
  const blogId=Number(req.params.blogId)
  
  try {
    const comments=await prisma.comment.findMany({
      where:{
        blogId,
        parentId:null
      },
      include:{
        user:{select:{id:true,name:true}},
        replies:{
          include:{
            user:{select:{id:true,name:true}}
          }
        }
      },
      orderBy:{createdAt:"desc"}
    })
    
    res.status(200).json({msg:"GComments fetched",comments})
  } catch (error:any) {
    console.log(error)
    res.status(500).json({msg:"Internal server error"})
  }
}

export { creatBlog,allBlogs,likeBlog ,addComment,unlikeBlog,allComment};
