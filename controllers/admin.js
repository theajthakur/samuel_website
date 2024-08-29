const { setUser } = require("../service/auth");
const { v4: uuidv4 } = require("uuid");
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

module.exports = { handleAdminLogin };
