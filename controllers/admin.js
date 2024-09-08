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
  const loweradmins = await Admin.findAll({ where: { parent: req.user.id } });
  const lowerUserPromises = loweradmins.map(async (d) => {
    return User.findAll({ where: { parent: d.id } });
  });
  const lowerUserResults = await Promise.all(lowerUserPromises);
  const lowerUser = lowerUserResults.flat();
  const combinedResults = [...loweradmins, ...users, ...lowerUser];
  return res.render("admin_panel", {
    introHeading: process.env.ADMIN_INTRODUCTION_HEADING,
    introPara1: process.env.ADMIN_INTRODUCTION_PARAGRAPH1,
    introPara2: process.env.ADMIN_INTRODUCTION_PARAGRAPH2,
    myRole: req.user.role,
    parentId: req.user.id,
    users: combinedResults,
  });
}

async function handleCreateUser(req, res) {
  const { name, email, usertype } = req.body;
  const { role, parent } = {
    role: "normal",
    parent: req.user.id,
  };
  const password = await bcrypt.hash(req.body.password, 10);
  try {
    if (usertype && usertype == "loweradmin" && req.user.role == "superadmin") {
      const { primaryColor, secondaryColor, backgroundColor, logo } = req.user;
      await Admin.create({
        name,
        email,
        role: "loweradmin",
        password,
        parent,
        primaryColor,
        secondaryColor,
        backgroundColor,
        logoName: logo,
      });
      return res.redirect("/admin/panel");
    }
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
  let user = [];
  let loweradmin = [];
  if (!["view", "delete", "delete_lower", "update"].includes(action))
    return res.end("Invalid Request!");
  if (req.query.roledata == "loweradmin") {
    loweradmin = await Admin.findOne({
      where: { id: id, parent: req.user.id },
    });
    if (!loweradmin) return res.json({ error: "No Admin found!" });
  } else {
    user = await User.findOne({ where: { id: id, parent: req.user.id } });
    if (!user) return res.json({ error: "No User found!" });
    user.password = "********";
  }
  if (action == "view") {
    if (req.query.roledata == "loweradmin") {
      loweradmin.password = "******";
      return res.json(loweradmin);
    } else {
      return res.json(user);
    }
  } else if (action == "delete") {
    User.destroy({ where: { id: id, parent: req.user.id } }).then((d) => {
      res.json({
        status: "success",
        id: id,
      });
    });
  } else if (action == "delete_lower") {
    Admin.destroy({ where: { id: id, parent: req.user.id } }).then((d) => {
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
      { where: { id: id, parent: req.user.id } }
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
