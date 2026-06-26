const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  googleLogin
} = require("../controller/authController");

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Google Login
router.post("/google", googleLogin);

module.exports = router;