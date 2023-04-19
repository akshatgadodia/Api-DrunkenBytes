const express = require('express')
const router = express.Router()
const verifyUserToken = require("../middlewares/verifyUserToken")
const verifyUserRoles = require("../middlewares/verifyUserRoles")
const ROLES_LIST = require("../utils/rolesList")
const { loginUser, verifyUser, updateUserData, getUser, getAllUsers, logoutUser, initialLoginUser, saveUserRegisterRequest, getUserProfile } = require('../controllers/userController')

router.post('/initial-login', initialLoginUser);
router.post('/login', loginUser);
router.post('/user-register-request', saveUserRegisterRequest);
router.get("/get-user-profile", verifyUserToken, verifyUserRoles(ROLES_LIST.USER), getUserProfile);
router.patch('/update', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.USER), updateUserData);
router.post("/logout", logoutUser)

router.get("/get-user", verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.SUPPORT, ROLES_LIST.SALES), getUser);
router.get("/get-all-users", verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.SUPPORT, ROLES_LIST.SALES), getAllUsers);
router.patch('/verify-user/:id', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.SUPPORT, ROLES_LIST.SALES), verifyUser);

module.exports = router