const { setUser } = require("../service/auth");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) {
    res.render("login", {
      error: "invalid Credentials",
    });
  } else {
    const token = setUser(user);
    res.cookie("token", token);
    return res.redirect("/");
  }
  return res.json({ name: "Ajay" });
}

module.exports = {
  handleUserSignUp,
  handleUserLogin,
};
