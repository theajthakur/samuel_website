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
    return res.render("superadmin_login.ejs", {
      error: "Invalid Credentials!",
    });
  }
}

async function handleSuper(req, res) {
  return res.render("login.ejs");
}

async function handleSuperPanel(req, res) {
  const users = await Admin.findAll({});
  return res.render("superowner.ejs", {
    users: users,
  });
}

async function handleCreateUser(req, res) {
  if (req.user?.role == "owner") {
    var { name, email, primaryColor, secondaryColor, logoName } = req.body;
    var { role, parent } = {
      role: "superadmin",
      parent: "1",
    };
  } else {
    var { name, email, role, parent, primaryColor, secondaryColor, logoName } =
      req.body;
  }
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
