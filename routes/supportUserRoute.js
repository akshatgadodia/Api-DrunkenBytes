const express = require("express");
const router = express.Router();
const verifyUserToken = require("../middlewares/verifyUserToken")
const verifyUserRoles = require("../middlewares/verifyUserRoles")
const ROLES_LIST = require("../utils/rolesList")
const {
  registerSupportUser,
  loginSupportUser
} = require("../controllers/supportUserController");

router.post("/login", loginSupportUser);
router.post("/register", verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN), registerSupportUser);

module.exports = router;
