const express = require("express");
const { restrictTo, NotrestrictTo } = require("../middlewares/auth");
const router = express.Router();
const {
  handleSuper,
  handleSuperLogin,
  handleSuperPanel,
  handleCreateUser,
  handleSuperProfile,
} = require("../controllers/super_owner");

router.get("/", NotrestrictTo(["owner"], "/super/panel"), handleSuper);
router.post("/", NotrestrictTo(["owner"], "/super/panel"), handleSuperLogin);

router.get("/panel", restrictTo(["owner"], "/super"), handleSuperPanel);
router.get(
  "/profile/:action/:id",
  restrictTo(["owner"], "/super"),
  handleSuperProfile
);
router.post("/new_user", restrictTo(["owner"], "/super"), handleCreateUser);

module.exports = router;
