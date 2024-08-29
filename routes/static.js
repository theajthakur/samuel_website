const express = require("express");
const { restrictTo, NotrestrictTo } = require("../middlewares/auth");
const { handleUserLogin, handleHomepage } = require("../controllers/user");
const User = require("../models/User");
const router = express.Router();

router.get("/", restrictTo(["NORMAL"]), handleHomepage);

router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.post("/login", handleUserLogin);

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

router.get("/profile", restrictTo(["NORMAL", "ADMIN"]), (req, res) => {
  return res.status(200).json(req.user);
});

module.exports = router;
