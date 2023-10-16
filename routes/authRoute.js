const { registerUser, loginUser } = require("../services/authService");

const router = require("express").Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
