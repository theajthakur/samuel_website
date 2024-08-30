const { setUser, getUser } = require("../service/auth");
const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");

async function handleSuperLogin(req, res) {
  const email = "samuel@admin.com";
  const pass = "1234";
  if (req.body.email == email && req.body.password == pass) {
    const user = {
      _id: "test",
      username: "Samuel Hufnagel",
      role: "owner",
      email: "ajay@gmail.com",
    };
    const token = setUser(user);
    res.cookie("token", token);
    return res.redirect("/super/panel");
  } else {
    return res.render("login", {
      error: "Invalid Credentials!",
    });
  }
}

async function handleSuper(req, res) {
  return res.render("login");
}

async function handleSuperPanel(req, res) {
  const users = await Admin.findAll({});
  return res.render("superowner", {
    users: users,
  });
}

async function handleCreateUser(req, res) {
  var { name, email, primaryColor, secondaryColor, backgroundColor, logoName } =
    req.body;
  var { role, parent } = {
    role: "superadmin",
    parent: "1",
  };
  const password = await bcrypt.hash(req.body.password, 10);
  try {
    await Admin.create({
      name,
      email,
      role,
      password,
      parent,
      primaryColor,
      secondaryColor,
      backgroundColor,
      logoName,
    });
    return res.redirect("/super/panel");
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error:
        "An error occured. Please check if all the required data was sent from your end!",
    });
  }
}

module.exports = {
  handleSuperLogin,
  handleSuper,
  handleSuperPanel,
  handleCreateUser,
};
