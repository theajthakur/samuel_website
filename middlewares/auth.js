const { getUser } = require("../service/auth");

function checkForAuthentication(req, res, next) {
  const tokenCookie = req.cookies?.token;
  req.user = null;

  if (!tokenCookie) return next();

  const token = tokenCookie;
  if (!token) return null;
  const user = getUser(token);
  req.user = user;
  next();
}

function checkForSuperAuth(req, res, next) {
  const tokenCookie = req.cookies?.super_token;
  req.user = null;

  if (!tokenCookie) return next();

  const token = tokenCookie;
  if (!token) return null;
  const user = getUser(token);
  req.user = user;
  next();
}

function restrictTo(role = []) {
  return function (req, res, next) {
    if (!req.user) return res.redirect("/login");

    if (!role.includes(req.user.role)) return res.end("unauthorised");

    next();
  };
}

function NotrestrictTo(role = []) {
  return function (req, res, next) {
    if (req.user) return res.redirect("/");
    next();
  };
}
module.exports = {
  checkForAuthentication,
  checkForSuperAuth,
  restrictTo,
  NotrestrictTo,
};
