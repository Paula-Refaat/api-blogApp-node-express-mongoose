const fs = require("fs");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const { uploadSingleImage } = require("../middleware/photoUpload");
const {
  cloudinaryRemoveImage,
  cloudinaryUploadImage,
} = require("../utils/cloudinary");
const Post = require("../models/postModel");

exports.uploadPostImageToServer = uploadSingleImage("image");

exports.setUserIdToBody = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
// @desc    Upload post image to cloudinary
exports.uploadPostImageTocloudinary = async (req, res, next) => {
  if (req.file) {
    const result = await cloudinaryUploadImage(req.file.path);
    req.body.image = {
      url: result.url,
      publicId: result.public_id,
    };
    fs.unlinkSync(req.file.path);
  }
  next();
};

// @desc    Create new post
// @router  POST /api/v1/posts
// @access  public/protected
exports.createPost = asyncHandler(async (req, res, next) => {
  const post = await Post.create(req.body);
  res.status(201).json({ message: "Post created succssfully", post });
});

// @desc    Get All posts
// @router  Get /api/v1/posts
// @access  private(admin only)/protected
exports.getAllPosts = asyncHandler(async (req, res, next) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;

  const posts = await Post.find({}).limit(limit).skip(skip);

  res.status(200).json({ page: page, limit: limit, posts });
});

// @desc    Get Specific post
// @router  Get /api/v1/posts
// @access  public
exports.getOnePost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params.id;

  const post = await Post.findById(postId);
  if (!post) {
    return next(new ApiError(`post not found for this id ${postId}`));
  }
  res.status(200).json({ data: post });
});
