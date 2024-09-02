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

async function handleAdminProfile(req, res) {
  const { action, id } = req.params;
  if (!["view", "delete", "update"].includes(action))
    return res.end("Invalid Request!");
  const user = await User.findOne({ where: { id: id } });
  if (!user) return res.json({ error: "No User found!" });
  user.password = "********";
  if (action == "view") {
    return res.json(user);
  } else if (action == "delete") {
    User.destroy({ where: { id: id } }).then((d) => {
      res.json({
        status: "success",
        id: id,
      });
    });
  } else if (action == "update") {
    if (!req.query.uname && !req.query.uemail && !req.query.ustatus)
      return res.json({
        status: "error",
        message: "Data Can't be empty!",
        data: req.query,
      });
    const input = req.query;
    User.update(
      { name: input.uname, email: input.uemail, role: input.ustatus },
      { where: { id: id } }
    )
      .then((d) => {
        const message = `Data Updated for user ${input.uname}`;
        return res.json({
          status: "success",
          message: message,
        });
      })
      .catch((error) => {
        var message = "Updation failed!";
        if (error.name == "SequelizeUniqueConstraintError") {
          message = "an user with same email id Already exists";
        }
        return res.json({
          status: "error",
          message: message,
        });
      });
  }
}

module.exports = {
  handleAdminLogin,
  handleAdminPanel,
  handleCreateUser,
  handleAdminProfile,
};
