const express = require('express')
const router = express.Router()
const { saveArticle,getArticlesByUrl,getArticles,updateArticle } = require('../controllers/articleController')

router.post('/save-article',saveArticle);
router.get('/get-articles', getArticles);
router.get('/article', getArticlesByUrl);
router.put('/update-article', updateArticle);

module.exports = router