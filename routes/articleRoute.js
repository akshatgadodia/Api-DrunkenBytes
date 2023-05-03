const express = require('express')
const router = express.Router()
const { saveArticle,getArticlesByUrl,getArticles,updateArticle } = require('../controllers/articleController')
const verifyUserToken = require("../middlewares/verifyUserToken")
const verifyUserRoles = require("../middlewares/verifyUserRoles")
const ROLES_LIST = require("../utils/rolesList")

router.post('/save-article', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.EDITOR), saveArticle);
router.get('/get-articles', getArticles);
router.get('/article', getArticlesByUrl);
router.put('/update-article', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.EDITOR), updateArticle);

module.exports = router