const fs = require("fs");
const path = require("path");
const asyncHandeler = require("express-async-handler");
const { Post, validateCreatePost } = require("../modules/postModel");
const { cloudinaryUploadImage } = require("../utils/cloudinary");

// @desc    Create New Post
// @router  POST /api/posts
// @access  private (only logged in user)

exports.createPost = asyncHandeler(async (req, res) => {
  // 1. Validation for image
  if (!req.file) {
    return res.status(400).json({ message: "mo image provided" });
  }
  // 2. Validation for data
  const { error } = validateCreatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // 3. Uploade photo
  const result = await cloudinaryUploadImage(req.file.path);

  // 4. Create new post and save it to db
  const post = await Post.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    user: req.user.id,
    image: {
      url: result.secure_url,
      publicId: result.public_Id,
    },
  });
  // 5. Send response to clint
  res.status(201).json(post);
  // 6. remove image from the server
  try {
    fs.unlinkSync(req.file.path);
  } catch (error) {
    return error;
  }
});
