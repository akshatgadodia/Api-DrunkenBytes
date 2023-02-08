const express = require('express')
const router = express.Router()
const verifyUserToken = require("../middlewares/verifyUserToken")
const verifyUserRoles = require("../middlewares/verifyUserRoles")
const ROLES_LIST = require("../utils/rolesList")
const {  saveMessage, getMessages, getMessageById } = require('../controllers/messageController')

// router.post('/generate-api-key', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.USER), generateAPIKey);
router.post('/save-message', saveMessage);
router.get('/get-messages', getMessages);
router.get('/message/:messageId', getMessageById);

module.exports = router