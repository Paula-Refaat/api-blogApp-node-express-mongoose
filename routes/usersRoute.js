const { verifyTokenAndAdmin } = require("../middleware/verifyToken");
const { getAllUsers } = require("../services/userService");

const router = require("express").Router();

router.get("/profile", verifyTokenAndAdmin, getAllUsers);

module.exports = router;
