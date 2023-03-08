const express = require('express')
const router = express.Router();
const verifyUserToken = require("../middlewares/verifyUserToken")
const verifyUserRoles = require("../middlewares/verifyUserRoles")
const ROLES_LIST = require("../utils/rolesList")
const { saveProduct, getProducts} = require('../controllers/productController')

router.post('/', verifyUserToken, verifyUserRoles(ROLES_LIST.USER), saveProduct);
router.get('/', verifyUserToken, verifyUserRoles(ROLES_LIST.USER), getProducts);

module.exports = router