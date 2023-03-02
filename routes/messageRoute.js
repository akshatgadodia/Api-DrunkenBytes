const express = require('express')
const router = express.Router()
const verifyUserToken = require("../middlewares/verifyUserToken")
const verifyUserRoles = require("../middlewares/verifyUserRoles")
const ROLES_LIST = require("../utils/rolesList")
const {  saveMessage, getMessages, getMessageById, getDashboardMessages } = require('../controllers/messageController')

// router.post('/generate-api-key', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.USER), generateAPIKey);
router.post('/save-message', verifyUserToken, saveMessage);
router.post('/save-contact-message', saveMessage);
router.get('/get-dashboard-messages', getDashboardMessages);
router.get('/get-messages', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.SUPPORT, ROLES_LIST.EDITOR), getMessages);
router.get('/message/:messageId', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.SUPPORT, ROLES_LIST.EDITOR), getMessageById);

module.exports = router