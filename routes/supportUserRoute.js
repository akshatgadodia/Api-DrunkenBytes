const express = require("express");
const router = express.Router();
const verifyUserToken = require("../middlewares/verifyUserToken")
const verifyUserRoles = require("../middlewares/verifyUserRoles")
const ROLES_LIST = require("../utils/rolesList")
const {
  registerSupportUser,
  loginSupportUser,
  logoutSupportUser,
  getSupportUserProfile,
  changePassword,
  getSupportUser,
  getAllSupportUsers
} = require("../controllers/supportUserController");

router.post("/login", loginSupportUser);
router.post("/register", verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN), registerSupportUser);
router.get("/get-user-profile", verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.SALES, ROLES_LIST.SUPPORT, ROLES_LIST.EDITOR), getSupportUserProfile);
router.post("/change-password", verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.SALES, ROLES_LIST.SUPPORT, ROLES_LIST.EDITOR), changePassword)
router.post("/logout", verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.SALES, ROLES_LIST.SUPPORT, ROLES_LIST.EDITOR), logoutSupportUser)

router.get("/get-support-user", verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.SUPPORT, ROLES_LIST.SALES, ROLES_LIST.EDITOR), getSupportUser);
router.get("/get-all-support-users", verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.SUPPORT, ROLES_LIST.SALES, ROLES_LIST.EDITOR), getAllSupportUsers);

module.exports = router;
