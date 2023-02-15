const express = require('express')
const router = express.Router()
const verifyUserToken = require("../middlewares/verifyUserToken")
const verifyUserRoles = require("../middlewares/verifyUserRoles")
const ROLES_LIST = require("../utils/rolesList")
const { loginUser, updateUserData, getUser, getAllUsers } = require('../controllers/userController')

router.get("/get-user", getUser);
router.get("/get-all-users", getAllUsers);
router.post('/login', loginUser);
router.patch('/update', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.USER), updateUserData);

module.exports = router