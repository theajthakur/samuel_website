const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const staticRoute = require("./routes/static");
require("dotenv").config();

const { checkForAuthentication, restrictTo } = require("./middlewares/auth");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.locals.primaryColor = process.env.PRIMARY_COLOR;
  res.locals.secondaryColor = process.env.SECONDARY_COLOR;
  res.locals.backgroundColor = process.env.BACKGROUND_COLOR;
  res.locals.logoPath = process.env.LOGO_PATH;
  res.locals.authorName = process.env.AUTHOR_NAME;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

app.use("/", staticRoute);

app.listen(8000, () => {
  console.log("Server Started!");
});
