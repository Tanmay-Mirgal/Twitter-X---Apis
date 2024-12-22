import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
import bcryptjs from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';


export const getUserProfile = async (req, res) => {
	const { username } = req.params;

	try {
		const user = await User.findOne({ username }).select('-password');
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ message: 'Internal server error' });
	}
}


export const getSuggestedUsers = async (req, res) => {
	try {
		const userId = req.user._id;

		const userFollowedByMe = await User.findById(userId).select("following");
		const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId }
				}
			},
			{ $sample: { size: 10 } },
		])
		const filteredUsers = users.filter(user => !userFollowedByMe.following.includes(user._id));
		const suggestedUsers = filteredUsers.slice(0, 10);
		suggestedUsers.forEach(user => {
			user.password = null;
		});
		res.status(200).json(suggestedUsers);


	} catch (error) {
		res.status(500).json({ message: 'Internal server error' });
		console.log(error)
	}
}

export const followUser = async (req, res) => {
	try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === req.user._id.toString()) {
			return res.status(400).json({ error: "You can't follow/unfollow yourself" });
		}

		if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) {
			// Unfollow the user
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

			res.status(200).json({ message: "User unfollowed successfully" });
		} else {
			// Follow the user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			// Send notification to the user
			const notification = new Notification({
				from: req.user._id,
				to: id,
				type: "follow",
			});
			await notification.save();

			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (error) {
		console.log("Error in followUnfollowUser: ", error.message);
		res.status(500).json({ error: error.message });
	}


}

export const updateUserProfile = async (req, res) => {
    const { email, fullName, username, currentPassword, newPassword, bio, link } = req.body;
    let { profilePicture, coverPicture } = req.body;
    const userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if ((newPassword && !currentPassword) || (!newPassword && currentPassword)) {
            return res.status(400).json({ message: 'Please provide both new password and current password' });
        }

        if (newPassword && currentPassword) {
            const isMatch = await bcryptjs.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters long' });
            }
            const salt = await bcryptjs.genSalt(12);
            user.password = await bcryptjs.hash(newPassword, salt);
        }

        if (profilePicture) {
            if (user.profilePicture) {
                await cloudinary.uploader.destroy(user.profilePicture.split('/').pop().split('.')[0]);
            }
            const uploadedPicture = await cloudinary.uploader.upload(profilePicture);
            profilePicture = uploadedPicture.secure_url;
        }

        if (coverPicture) {
            if (user.coverPicture) {
                await cloudinary.uploader.destroy(user.coverPicture.split('/').pop().split('.')[0]);
            }
            const uploadedCoverPicture = await cloudinary.uploader.upload(coverPicture);
            coverPicture = uploadedCoverPicture.secure_url;
        }

        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profilePicture = profilePicture || user.profilePicture;
        user.coverPicture = coverPicture || user.coverPicture;

        await user.save();
        res.status(200).json({ message: 'Profile updated successfully', user: {
			_id: user._id,
			fullName: fullName || user.fullName,
			email: email || user.email,
			username: username || user.username,
			bio: bio || user.bio,
			link: link || user.link,
			profilePicture: profilePicture || user.profilePicture,
			coverPicture: coverPicture || user.coverPicture,
			
		}});
		

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        console.log(error);
    }
}
