const { setUser, getUser } = require("../service/auth");

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
    res.cookie("super_token", token);
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
  return res.render("superowner.ejs");
}

module.exports = {
  handleSuperLogin,
  handleSuper,
  handleSuperPanel,
};
