const { setUser } = require("../service/auth");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const Admin = require("../models/Admin");
const axios = require("axios");
const bcrypt = require("bcrypt");
require("dotenv").config();

async function handleAdminLogin(req, res) {
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

    const user = await Admin.findOne({ where: { email } });

    if (!user) {
      return res.render("login", {
        error: "Invalid Email",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", {
        error: "Invalid Password",
      });
    }

    const token = setUser(user);
    res.cookie("token", token);
    return res.redirect("/admin/panel");
  } catch (error) {
    console.error("Error during reCAPTCHA verification:", error);
    return res.render("login", {
      error:
        "An error occurred during reCAPTCHA verification. Please try again.",
    });
  }
}

async function handleAdminPanel(req, res) {
  const users = await User.findAll({ where: { parent: req.user.id } });
  return res.render("admin_panel", {
    introHeading: process.env.ADMIN_INTRODUCTION_HEADING,
    introPara1: process.env.ADMIN_INTRODUCTION_PARAGRAPH1,
    introPara2: process.env.ADMIN_INTRODUCTION_PARAGRAPH2,
    users: users,
    csrfToken: req.csrfToken(),
  });
}

async function handleCreateUser(req, res) {
  const { name, email } = req.body;
  const { role, parent } = {
    role: "NORMAL",
    parent: req.user.id,
  };
  const password = await bcrypt.hash(req.body.password, 10);
  try {
    await User.create({
      name,
      email,
      role,
      password,
      parent,
    });
    return res.redirect("/admin/panel");
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error:
        "An error occured. Please check if all the required data was sent from your end!",
    });
  }
}
module.exports = { handleAdminLogin, handleAdminPanel, handleCreateUser };
