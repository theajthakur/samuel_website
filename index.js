const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const staticRoute = require("./routes/static");
const superRoute = require("./routes/super");
const adminRoute = require("./routes/admin");
const csrf = require("csurf");
require("dotenv").config();

const { checkForAuthentication, restrictTo } = require("./middlewares/auth");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// const csrfProtection = csrf({
//   cookie: {
//     httpOnly: true, // Helps to prevent client-side scripts from accessing the token
//     secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
//     sameSite: "Strict", // Adjust as needed (can be 'Lax' or 'None')
//   },
// });

// app.use(csrfProtection);

app.use(checkForAuthentication);
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken ? req.csrfToken() : "";
  res.locals.authorName = process.env.AUTHOR_NAME;
  res.locals.primaryColor = req.user?.primaryColor;
  res.locals.secondaryColor = req.user?.secondaryColor;
  res.locals.backgroundColor = req.user?.backgroundColor;
  res.locals.logoName = req.user?.logo;
  next();
});
app.use("/", staticRoute);
app.use("/super", superRoute);
app.use("/admin", adminRoute);

app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    res.status(403);
    res.send("Invalid CSRF token");
  } else {
    next(err);
  }
});

app.listen(8000, () => {
  console.log("Server Started!");
});
