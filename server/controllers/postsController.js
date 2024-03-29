const { success, error } = require("../utils/responseWrapper");
const Post = require("../models/Post");
const User = require("../models/User");
const { mapPostOutput } = require("../utils/Utils");
const cloudinary = require('cloudinary').v2;

const createPostController = async (req, res) => {
  try {
    const { caption, postImg } = req.body; //get caption from body
    if(!caption || !postImg){
        return res.send(error(400,'caption and post image is required'));
    }
    const cloudImg = await cloudinary.uploader.upload(postImg, {
      folder: 'posting'
    })
    const owner = req._id; //accessing owner from middleware

    const user = await User.findById(req._id); //finding user

    const post = await Post.create({
      owner,
      caption,
      image: {
        publicId: cloudImg.public_id,
        url: cloudImg.url
    }
    });

    user.posts.push(post._id); //pushing post in user array of post in schema database
    await user.save();

    return res.json(success(200,{ post }));
  } catch (e) {
    // console.log('This is my error',e);
    return res.send(error(500, e.message));
  }
};

const likeAndUnlikePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const curUserId = req._id;

    const post = await Post.findById(postId).populate('owner');
    if (!post) {
      return res.send(error(404, "Post not found."));
    }

    if (post.likes.includes(curUserId)) {
      const index = post.likes.indexOf(curUserId);
      post.likes.splice(index, 1);

    } else {
      post.likes.push(curUserId);
    }
    await post.save();
      return res.send(success(200, {post: mapPostOutput(post, req._id)}));
  } catch (e) {
    return res.send(error(500, e.message));
  }
};

const updatePostController = async (req, res) => {
  try {
    const { postId, caption } = req.body;
    const curUserId = req._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.send(error(404, "Post not Found"));
    }

    if (post.owner.toString() !== curUserId) {
      return res.send(error(403, "Only owners can update their post"));
    }
    if (caption) {
      post.caption = caption;
    }

    await post.save();
    return res.send(success(200, { post }));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

const deletePostController = async (req, res) => {
  try {
    const { postId } = req.body;
    const curUserId = req._id;

    const post = await Post.findById(postId);
    const curUser = await User.findById(curUserId);
    if (!post) {
      return res.send(error(404, "Post not Found"));
    }

    //here we used to string because owner is an object
    if (post.owner.toString() !== curUserId) {
      return res.send(error(403, "Only owners can update their post"));
    }

    const index = curUser.posts.indexOf(postId);
    curUser.posts.splice(index, 1);
    await curUser.save();
    await post.remove();

    return res.send(success(200, "post deleted successfully"));
  } catch (e) {
    res.send(error(500, e.message));
  }
};

module.exports = {
  createPostController,
  likeAndUnlikePost,
  updatePostController,
  deletePostController
};
