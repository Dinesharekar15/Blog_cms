import express from "express";
import cors from "cors"; // Import the cors package
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from 'cookie-parser';
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api/v1/auth', authRoutes);
app.use("/api/v1/user", userRoutes);
app.use('/api/v1/post', postRoutes);
app.listen(5000, () => {
    console.log("listening on post number 5000 ");
});
//# sourceMappingURL=index.js.map