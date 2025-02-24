const express = require("express");
const { registerUser, loginUser, getUserProfile, getAllUsers } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getUserProfile);
router.get("/allusers", authMiddleware, getAllUsers);

module.exports = router;
