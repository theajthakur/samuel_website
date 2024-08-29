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

function restrictTo(role = [], refer = "/login") {
  return function (req, res, next) {
    if (!req.user) return res.redirect(refer);

    if (!role.includes(req.user.role))
      return res.send("unauthorised <a href='/logout'>logout</a>");

    next();
  };
}

function NotrestrictTo(role = [], refer = "/") {
  return function (req, res, next) {
    if (req.user) return res.redirect(refer);
    next();
  };
}
module.exports = {
  checkForAuthentication,
  restrictTo,
  NotrestrictTo,
};
