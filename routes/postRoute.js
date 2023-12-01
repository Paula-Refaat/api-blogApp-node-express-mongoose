const router = require("express").Router();

const authService = require("../services/authService");
const {
  createPost,
  uploadPostImageToServer,
  setUserIdToBody,
  uploadPostImageTocloudinary,
} = require("../services/postServices");
const { createPostValidator } = require("../utils/validators/postValidator");

router.post(
  "/",
  authService.protect,
  uploadPostImageToServer,
  uploadPostImageTocloudinary,
  setUserIdToBody,
  createPostValidator,
  createPost
);

module.exports = router;
