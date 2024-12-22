import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text:{
    type: String,
    required: true
  },
  image:{
    type: String,
    required: true
  },
  likes:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  comments:[{
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    text:{
      type: String,
      required: true
    },
    date:{
      type: Date,
      default: Date.now
    }
  }],
  
},{timestamps: true}); 

const Post = mongoose.model("Post", postSchema);
export default Post;