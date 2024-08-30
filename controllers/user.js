const { setUser } = require("../service/auth");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const axios = require("axios");
const bcrypt = require("bcrypt");
require("dotenv").config();

async function handleUserSignUp(req, res) {
  const { name, email, password } = req.body;
  try {
    await User.create({
      name,
      email,
      password,
    });
    return res.redirect("/");
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "The email '" + error.errors[0].value + "' is already in use.",
        error: error.errors[0].message,
      });
    }

    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}

async function handleUserLogin(req, res) {
  const { email, password, "g-recaptcha-response": recaptchaToken } = req.body;

  const secretKey = process.env.SECRET_KEY;
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

  try {
    const response = await axios.post(verificationUrl);
    const { success } = response.data;

    if (!success) {
      return res.render("login", {
        error: "reCAPTCHA verification failed. Please try again.",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.render("login", {
        error: "Invalid Email",
      });
    }
    const admin = await Admin.findOne({ where: { id: user.parent } });
    if (!admin) return res.redirect("/logout");
    user.primaryColor = admin.primaryColor;
    user.secondaryColor = admin.secondaryColor;
    user.backgroundColor = admin.backgroundColor;
    user.logoName = admin.logoName;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", {
        error: "Invalid Password",
      });
    }

    const token = setUser(user);
    res.cookie("token", token);
    return res.redirect("/");
  } catch (error) {
    console.error("Error during reCAPTCHA verification:", error);
    return res.render("login", {
      error:
        "An error occurred during reCAPTCHA verification. Please try again.",
    });
  }
}

async function handleHomepage(req, res) {
  const allurls = await User.findOne({ email: req.user.email });
  return res.render("home", {
    username: req.user?.name,
  });
}

module.exports = {
  handleUserSignUp,
  handleUserLogin,
  handleHomepage,
};
