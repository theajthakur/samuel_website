const { setUser } = require("../service/auth");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const axios = require("axios");

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

  const secretKey = "6LdD5KcpAAAAALKexBlPfvJCwzLeDVGu-EAaq-XW";
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

  try {
    const response = await axios.post(verificationUrl);
    const { success } = response.data;

    if (!success) {
      return res.render("login", {
        error: "reCAPTCHA verification failed. Please try again.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.render("login", {
        error: "Invalid Email",
      });
    } else if (user.password !== password) {
      return res.render("login", {
        error: "Invalid Password",
      });
    } else {
      const token = setUser(user);
      res.cookie("token", token);
      return res.redirect("/");
    }
  } catch (error) {
    console.error("Error during reCAPTCHA verification:", error);
    return res.render("login", {
      error:
        "An error occurred during reCAPTCHA verification. Please try again.",
    });
  }
}

module.exports = {
  handleUserSignUp,
  handleUserLogin,
};
