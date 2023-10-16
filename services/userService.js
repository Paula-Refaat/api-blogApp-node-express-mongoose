const asyncHandler = require("express-async-handler");
const { User } = require("../modules/userModel");

// @desc    Get all user Profile
// @router  /api/users/profile
// @access  private(admin only)
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

// @desc    Get user Profile
// @router  /api/users/profile/:id
// @access  private(admin only)
exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if(!user){
    return res.status(404).json({message: "user not found"})
  }
  res.status(200).json(user);
});
