const express = require('express')
const router = express.Router();

const verifyUserToken = require("../middlewares/verifyUserToken")
const verifyUserRoles = require("../middlewares/verifyUserRoles")
const ROLES_LIST = require("../utils/rolesList")

const { getPerformanceData } = require('../controllers/adminDashboardController')

// router.post('/generate-api-key', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.USER), generateAPIKey);
router.get('/get-performance-data', getPerformanceData);

module.exports = router