const express = require("express");
const { restrictTo, NotrestrictTo } = require("../middlewares/auth");
const router = express.Router();
const {
  handleAdminLogin,
  handleAdminPanel,
  handleCreateUser,
} = require("../controllers/admin");

router.get("/", NotrestrictTo(["superadmin"], "/admin/panel"), (req, res) => {
  return res.render("login");
});

router.post(
  "/",
  NotrestrictTo(["superadmin"], "/admin/panel"),
  handleAdminLogin
);

router.get("/panel", restrictTo(["superadmin"], "/admin"), handleAdminPanel);
router.post("/new_user", handleCreateUser);
module.exports = router;
