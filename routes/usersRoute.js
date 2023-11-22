const photoUpload = require("../middleware/photoUpload");
const validateObjectId = require("../middleware/validateObjectId");
const {
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyToken,
  verifyTokenAndAuthorization,
} = require("../middleware/verifyToken");
const {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  profilePhotoUpload,
  deleteUserProfile,
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

router.delete(
  "/profile/:id",
  validateObjectId,
  verifyTokenAndAuthorization,
  deleteUserProfile
);

module.exports = router;
