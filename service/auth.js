const jwt = require("jsonwebtoken");
const secret = "Ajay@1234";

function setUser(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      primaryColor: user?.primaryColor,
      secondaryColor: user?.secondaryColor,
      backgroundColor: user?.backgroundColor,
      logo: user?.logoName,
    },
    secret
  );
}

function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
};
