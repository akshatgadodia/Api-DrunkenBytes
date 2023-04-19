const express = require('express')
const router = express.Router()
const verifyUserToken = require("../middlewares/verifyUserToken")
const verifyUserRoles = require("../middlewares/verifyUserRoles")
const ROLES_LIST = require("../utils/rolesList")
const { saveIssue, getIssue, getAllIssues, solveIssue, getIssues } = require('../controllers/issueController')

router.get('/get-issue-status/:tokenId', getIssue);
router.get('/get-issues', verifyUserToken, verifyUserRoles(ROLES_LIST.USER), getIssues );
router.patch('/solve-issue/:id', verifyUserToken, verifyUserRoles(ROLES_LIST.USER), solveIssue);
router.post('/save-issue', saveIssue);

router.get('/get-all-issues', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.SUPPORT, ROLES_LIST.SALES), getAllIssues);

module.exports = router