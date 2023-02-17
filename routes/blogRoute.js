const express = require('express')
const router = express.Router()
const { saveBlog,getBlogsByUrl,getBlogs,updateBlog } = require('../controllers/blogController')

router.post('/save-blog',saveBlog);
router.get('/get-blogs', getBlogs);
router.get('/blog', getBlogsByUrl);
router.put('/update-blog', updateBlog);

module.exports = router