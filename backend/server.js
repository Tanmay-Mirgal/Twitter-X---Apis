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
import path from 'path';
  


dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const  PORT = process.env.PORT || 4000;
const __dirname = path.resolve();

app.use(cors());
app.use(express.json({ limit: "5mb" })); // to parse req.body
// limit shouldn't be too high to prevent DOS
app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)
app.use(cookieParser());
app.use('/api/auth',authRoutes);
app.use('/api/user',userRoutes);
app.use('/api/post',postRoutes);
app.use('/api/notification',notificationRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectDB();
});