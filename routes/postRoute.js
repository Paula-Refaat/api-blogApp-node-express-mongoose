const router = require("express").Router();
const photoUpload = require("../middleware/photoUpload");
const { verifyToken } = require("../middleware/verifyToken");
const { createPost } = require("../services/postServices");

// /api/posts

router.put("/", verifyToken, photoUpload.single("image"), createPost);

module.exports = router;
