const express = require("express");
const { restrictTo, NotrestrictTo } = require("../middlewares/auth");
const router = express.Router();
const { handleAdminLogin } = require("../controllers/admin");

router.get("/", NotrestrictTo(["superadmin"], "/admin/panel"), (req, res) => {
  return res.render("login");
});
router.post(
  "/",
  NotrestrictTo(["superadmin"], "/admin/panel"),
  handleAdminLogin
);

router.get("/panel", restrictTo(["superadmin"], "/admin"), (req, res) => {
  return res.json(req.user);
});
module.exports = router;
