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

exports.createPost = asyncHandler(async (req, res, next) => {
  const post = await Post.create(req.body);
  res.status(201).json({ message: "Post created succssfully", post });
});
