import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    fullName:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    following:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    profilePicture:{
        type: String,
        default: ''
    },
    coverPicture:{
        type: String,
        default: ''
    },
    bio:{
        type: String,
        default: ''
    },
    location:{
        type: String,
        default: ''
    },
    website:{
        type: String,
        default: ''
    },
},{timestamps: true})

const User = mongoose.model('User', userSchema);

export default User;