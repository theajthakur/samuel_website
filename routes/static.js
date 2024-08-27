const express = require("express");
const { restrictTo } = require("../middlewares/auth");
const { handleUserSignUp, handleUserLogin } = require("../controllers/user");
const User = require("../models/User");
const router = express.Router();

router.get("/", restrictTo(["NORMAL", "ADMIN"]), async (req, res) => {
  const allurls = await User.findOne({ email: req.user.email });
  return res.render("home", {
    username: req.user?.name,
  });
});

router.get("/signup", async (req, res) => {
  return res.render("signup");
});

router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.post("/signup", handleUserSignUp);

router.post("/login", handleUserLogin);

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

module.exports = router;
