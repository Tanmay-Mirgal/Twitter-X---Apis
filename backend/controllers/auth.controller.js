import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();


export const signupController = async (req, res) => {
    try {
        const {username, fullName, email, password } = req.body;
        // validation
        if (!username,!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // validate email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        // check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // hash password
        const salt = await bcryptjs.genSalt(12);
        const hashedPassword = await bcryptjs.hash(password, salt);
        // create user to database
        const user = new User({ username, fullName, email, password: hashedPassword });

        // generate token
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
                // secure: NODE_ENV === 'production',
                sameSite: 'strict',
            });

            user.save();
            res.status(201).json({
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
                email: user.email,
                followers: user.followers,
                following: user.following,
                profilePicture: user.profilePicture,
                coverPicture: user.coverPicture,
                bio: user.bio,
                location: user.location,
                website: user.website,

            });

        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
          res.status(500).json({ message: error.message });
          console.log(error);
    }
};
export const loginController = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username }).select('+password');

        if (!user || !(await bcryptjs.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.status(200).json({
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profilePicture: user.profilePicture,
            coverPicture: user.coverPicture,
            bio: user.bio,
            location: user.location,
            website: user.website,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
};
export const logoutController = async (req, res) => {
    try {
        res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
    
};

export const getuserController = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profilePicture: user.profilePicture,
            coverPicture: user.coverPicture,
            bio: user.bio,
            location: user.location,
            website: user.website,
        });
    
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}