const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const { uploadSingleImage } = require("../middleware/photoUpload");
const {
  cloudinaryRemoveImage,
  cloudinaryUploadImage,
} = require("../utils/cloudinary");
const Post = require("../models/postModel");

exports.uploadPostImage = uploadSingleImage("image");

exports.createPost = asyncHandler(async (req, res, next) => {
  if (req.file) {
    var result = await cloudinaryUploadImage(req.file.path);
  }
  const post = await Post.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    user: req.user._id,
    image: {
      url: result.url,
      publicId: result.public_id,
    },
  });
  res.status(201).json({ message: "Post created succssfully", post });
  fs.unlinkSync(req.file.path);
});
