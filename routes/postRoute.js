const router = require("express").Router();

const authService = require("../services/authService");
const {
  createPost,
  uploadPostImageToServer,
  setUserIdToBody,
  uploadPostImageTocloudinary,
  getAllPosts,
  getOnePost,
  deletePostImagefromcloudinary,
  updatePost,
  deletePost,
} = require("../services/postServices");
const {
  createPostValidator,
  getOnePostValidator,
  updatePostValidator,
  deletePostValidator,
} = require("../utils/validators/postValidator");

router.post(
  "/",
  authService.protect,
  uploadPostImageToServer,
  uploadPostImageTocloudinary,
  setUserIdToBody,
  createPostValidator,
  createPost
);

router.get(
  "/",
  authService.protect,
  authService.allowTo("admin", "user"),
  getOnePostValidator,
  getOnePost
);

router.put(
  "/:id",
  authService.protect,
  authService.allowTo("user"),
  deletePostImagefromcloudinary,
  uploadPostImageToServer,
  uploadPostImageTocloudinary,
  updatePostValidator,
  updatePost
);

router.delete(
  "/:id",
  authService.protect,
  authService.allowTo("user", "admin"),
  deletePostImagefromcloudinary,
  deletePostValidator,
  deletePost
);

router.get("/", authService.protect, getAllPosts);

module.exports = router;
