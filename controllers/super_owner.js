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
    console.log(req.body);
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

async function handleSuperProfile(req, res) {
  const { action, id } = req.params;
  if (!["view", "delete", "update"].includes(action))
    return res.end("Invalid Request!");
  const user = await Admin.findOne({ where: { id: id } });
  if (!user) return res.json({ error: "No User found!" });
  user.password = "********";
  if (action == "view") {
    return res.json(user);
  } else if (action == "delete") {
    Admin.destroy({ where: { id: id } }).then((d) => {
      res.json({
        status: "success",
        id: id,
      });
    });
  } else if (action == "update") {
    if (!req.body.uname && !req.body.uemail && !req.body.ustatus)
      return res.json({
        status: "error",
        message: "Data Can't be empty!",
        data: req.query,
      });
    const input = req.body;
    Admin.update(
      { name: input.uname, email: input.uemail, role: input.ustatus },
      { where: { id: id } }
    )
      .then((d) => {
        const message = `Data Updated for Admin ${input.uname}`;
        return res.json({
          status: "success",
          message: message,
        });
      })
      .catch((error) => {
        var message = "Updation failed!";
        if (error.name == "SequelizeUniqueConstraintError") {
          message = "an Admin with same email id Already exists";
        }
        return res.json({
          status: "error",
          message: message,
        });
      });
  }
}

async function handleUploadImage(req, res) {
  const { type, id } = req.params;
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const uploadedFileName = req.file.filename;

  try {
    const user = await Admin.findOne({ where: { id: id } });
    if (!user) return res.json({ error: "No User found!" });
    if (user.logoName && user.logoName !== "logo.png") {
      const fs = require("fs");
      const filePath = "public/uploads/" + user.logoName;
      try {
        fs.unlinkSync(filePath);
        console.log("File deleted successfully");
      } catch (err) {
        console.error("Error deleting the file:", err.message);
      }
    }
    await Admin.update({ logoName: uploadedFileName }, { where: { id: id } });
    return res.json({
      status: "success",
      message: "File Uploaded",
      file: req.file,
    });
  } catch (error) {
    return res.json({
      status: "error",
      message: "Logo not updated!",
      file: req.file,
    });
  }
}
module.exports = {
  handleSuperLogin,
  handleSuper,
  handleSuperPanel,
  handleCreateUser,
  handleSuperProfile,
  handleUploadImage,
};
