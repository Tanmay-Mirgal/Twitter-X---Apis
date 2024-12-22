import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connectDB} from './lib/db.js';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import notificationRoutes from './routes/notification.route.js';
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary';
  


dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const  PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/post',postRoutes);
app.use('/api/notification',notificationRoutes);

connectDB();
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});