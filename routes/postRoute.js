const router = require("express").Router();

const authService = require("../services/authService");
const { createPost, uploadPostImage } = require("../services/postServices");
const { createPostValidator } = require("../utils/validators/postValidator");

router.post(
  "/",
  authService.protect,
  uploadPostImage,
  createPostValidator,
  createPost
);

module.exports = router;
