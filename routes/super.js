const express = require("express");
const { restrictTo, NotrestrictTo } = require("../middlewares/auth");
const router = express.Router();
const {
  handleSuper,
  handleSuperLogin,
  handleSuperPanel,
  handleCreateUser,
} = require("../controllers/super_owner");

router.get("/", NotrestrictTo(["owner"]), handleSuper);
router.post("/", NotrestrictTo(["owner"]), handleSuperLogin);

router.get("/panel", restrictTo(["owner"]), handleSuperPanel);
router.post("/new_user", restrictTo(["owner"]), handleCreateUser);

module.exports = router;
