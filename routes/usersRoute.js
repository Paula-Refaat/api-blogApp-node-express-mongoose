const photoUpload = require("../middleware/photoUpload");
const validateObjectId = require("../middleware/validateObjectId");
const {
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyToken,
} = require("../middleware/verifyToken");
const {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  profilePhotoUpload,
} = require("../services/userService");

const router = require("express").Router();

router.get("/profile", verifyTokenAndAdmin, getAllUsers);
router.get("/profile/:id", validateObjectId, getUserProfile);
router.put(
  "/profile/:id",
  validateObjectId,
  verifyTokenAndOnlyUser,
  updateUserProfile
);
router.post(
  "/profile/profile-photo-upload",
  verifyToken,
  photoUpload.single("image"),
  profilePhotoUpload
);

module.exports = router;
