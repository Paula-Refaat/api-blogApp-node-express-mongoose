const fs = require("fs");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateUpdateUser } = require("../modules/userModel");
const {
  cloudinaryRemoveImage,
  cloudinaryUploadImage,
} = require("../utils/cloudinary");

// @desc    Get all user Profile
// @router  /api/users/profile
// @access  private(admin only)
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});

// @desc    Get user Profile
// @router  GET /api/users/profile/:id
// @access  public
exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  res.status(200).json(user);
});

// @desc    Update user Profile
// @router  PUT /api/users/profile/:id
// @access  only user update
exports.updateUserProfile = asyncHandler(async (req, res, next) => {
  // 1. Validation
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio,
      },
    },
    { new: true }
  ).select("-password");

  res.status(200).json(updatedUser);
});

// @desc    Profile Photo Upload
// @router  POST /api/users/profile/profile-photo-upload
// @access  private (only loged in user)
exports.profilePhotoUpload = asyncHandler(async (req, res, next) => {
  // 1. Validation
  if (!req.file) {
    return res.status(400).json({ message: "no file provided" });
  }
  // 2. Upload to cloudinary
  const result = await cloudinaryUploadImage(req.file.path);

  // 3. Get the user from DB
  const user = await User.findById(req.user.id);

  // 4. Delete the old profile photo if exist
  if (user.profilePhoto.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  // 5. Change the profilePhoto field in the DB
  user.profilePhoto = {
    url: result.secure_url,
    publicId: result.public_id,
  };
  await user.save();

  // 6. Send respone to client
  res.status(200).json({
    message: "your profile photo uploaded successfully",
    profilePhoto: { url: result.secure_url, publicId: result.public_id },
  });

  // 7. Remove image from the server
  try {
    fs.unlinkSync(req.file.path);
  } catch (error) {
    return error;
  }
});

// @desc   Delete User Profile (Account)
// @router  POST /api/users/profile/:id
// @access  private (only admin or user jims self)
exports.deleteUserProfile = asyncHandler(async (req, res) => {
  // 1. Get the user from DB
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  //@TODO 2. Get all posts from DB
  //@TODO 3. Get the public ids from the posts
  //@TODO 4. Delete all posts image from cloudinary that belong to this user

  // 5. Delete the profile picture from cloudinary
  await cloudinaryRemoveImage(user.profilePhoto.publicId);

  //@TODO 6. Delete user posts & comments

  // 7. Delete the user him self
  await User.findByIdAndDelete(req.params.id);
  // 8. Send a response to the client
  res.status(200).json({message: "your profile has been deleted"})
});
