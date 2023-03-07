const express = require('express')
const router = express.Router()
const verifyUserToken = require("../middlewares/verifyUserToken")
const verifyUserRoles = require("../middlewares/verifyUserRoles")
const ROLES_LIST = require("../utils/rolesList")
const { loginUser, updateUserData, getUser, getAllUsers, logoutUser, initialLoginUser, saveUserRegisterRequest, getUserProfile } = require('../controllers/userController')

router.get("/get-user", getUser);
router.get("/get-user-profile", verifyUserToken, verifyUserRoles(ROLES_LIST.USER), getUserProfile);
router.get("/get-all-users", getAllUsers);
router.post('/initial-login', initialLoginUser);
router.post('/login', loginUser);
router.post('/user-register-request', saveUserRegisterRequest);
router.patch('/update', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.USER), updateUserData);
router.post("/logout", logoutUser)

module.exports = router