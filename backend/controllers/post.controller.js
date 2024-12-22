
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import {v2 as cloudinary} from "cloudinary";

export const createPost = async (req, res) => {
    try {
        const { text, img } = req.body;
		const userId = req.user._id.toString();

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		if (!text && !img) {
			return res.status(400).json({ error: "Post must have text or image" });
		}

		let imageUrl = img;
		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			imageUrl = uploadedResponse.secure_url;
		}

		const newPost = new Post({
			user: userId,
			text,
			image: imageUrl,
		});

		await newPost.save();
		res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }

}
export const deletePost = async (req, res) => {
    try {

    } catch (error) {

    }
}
export const likePost = async (req, res) => {
    try {

    } catch (error) {

    }
}
export const commentPost = async (req, res) => {
    try {

    } catch (error) {   

    }
}