const express = require('express')
const router = express.Router()
const verifyUserToken = require("../middlewares/verifyUserToken")
const verifyUserRoles = require("../middlewares/verifyUserRoles")
const ROLES_LIST = require("../utils/rolesList")
const { saveIssue, getIssue, getAllIssues, solveIssue  } = require('../controllers/issueController')

router.get('/get-issue-status/:tokenId', getIssue);
router.get('/get-issues', verifyUserToken, verifyUserRoles(ROLES_LIST.USER), getAllIssues);
router.patch('/solve-issue/:id', verifyUserToken, verifyUserRoles(ROLES_LIST.USER), solveIssue);
router.post('/save-issue', saveIssue);

module.exports = router