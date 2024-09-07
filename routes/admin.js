const express = require("express");
const { restrictTo, NotrestrictTo } = require("../middlewares/auth");
const router = express.Router();
const {
  handleAdminLogin,
  handleAdminPanel,
  handleCreateUser,
  handleAdminProfile,
} = require("../controllers/admin");

router.get(
  "/",
  NotrestrictTo(["superadmin", "loweradmin"], "/admin/panel"),
  (req, res) => {
    return res.render("login");
  }
);
router.get(
  "/profile/:action/:id",
  restrictTo(["superadmin", "loweradmin"], "/admin"),
  handleAdminProfile
);
router.post(
  "/",
  NotrestrictTo(["superadmin", "loweradmin"], "/admin/panel"),
  handleAdminLogin
);

router.get(
  "/panel",
  restrictTo(["superadmin", "loweradmin"], "/admin"),
  handleAdminPanel
);
router.post("/new_user", handleCreateUser);
module.exports = router;
