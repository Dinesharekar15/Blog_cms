import express from "express"
import cors from "cors" // Import the cors package
import authRoutes from "./routes/authRoutes.js"
import postRoutes from "./routes/blogRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import cookieParser from 'cookie-parser'
import type { Response,Request } from "express"
const app =express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin:"http://localhost:3000",
  credentials:true
}))
 

app.use('/api/v1/auth',authRoutes)
app.use("/api/v1/user",userRoutes)
app.use('/api/v1/blog',postRoutes)


app.get('/',async(req:Request,res:Response)=>{

  res.status(200).json({mag:"dinesh"})

})



app.listen(5000,()=>{
  console.log("listening on post number 5000 ")
})


