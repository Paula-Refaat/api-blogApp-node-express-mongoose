const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../modules/userModel");

// @desc    Register new user - SignUp
// @router  /api/auth/register
// @access  public
exports.registerUser = asyncHandler(async (req, res) => {
  // validation
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }

  // is user already exist
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).json({ message: "User already exists" });
  }

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // new user nad save it to DB
  user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  // send response to client
  res.status(201).json({ status: "you register successfully", data: user });
});

// @desc    Login user
// @router  POST /api/auth/login
// @access  public
exports.loginUser = asyncHandler(async (req, res) => {
  // 1. Validation
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  // 2. check is user exist and the password is correct?
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    res.status(401).json({ message: "Incorrect email or password" });
  }

  // 3. generate token (jwt)
  const token = user.generateAuthToken();

  // 4. response to client
  res.status(200).json({
    _id: user._id,
    isAdmin: user.isAdmin,
    profilePhoto: user.profilePhoto,
    token,
  });
});
