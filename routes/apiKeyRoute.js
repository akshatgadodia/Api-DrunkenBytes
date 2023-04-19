const express = require('express')
const router = express.Router()
const verifyUserToken = require("../middlewares/verifyUserToken")
const verifyUserRoles = require("../middlewares/verifyUserRoles")
const ROLES_LIST = require("../utils/rolesList")
const { generateAPIKey, deleteAPIKey, getApiKeys, getAllApiKeys } = require('../controllers/apiKeyController')

router.get('/get-api-keys', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.USER), getApiKeys);
router.post('/generate-api-key', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.USER), generateAPIKey);
router.delete('/delete-api-key/:key', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.USER), deleteAPIKey);

router.get("/get-all-api-keys", verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.SUPPORT), getAllApiKeys);

module.exports = router