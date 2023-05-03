const express = require('express')
const router = express.Router()
const { saveBlog,getBlogsByUrl,getBlogs,updateBlog } = require('../controllers/blogController')
const verifyUserToken = require("../middlewares/verifyUserToken")
const verifyUserRoles = require("../middlewares/verifyUserRoles")
const ROLES_LIST = require("../utils/rolesList")

router.post('/save-blog', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.EDITOR), saveBlog);
router.get('/get-blogs', getBlogs);
router.get('/blog', getBlogsByUrl);
router.put('/update-blog', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.EDITOR), updateBlog);

module.exports = router