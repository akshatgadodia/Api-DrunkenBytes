const express = require('express')
const router = express.Router();
const verifyUserToken = require("../middlewares/verifyUserToken")
const verifyUserRoles = require("../middlewares/verifyUserRoles")
const ROLES_LIST = require("../utils/rolesList")
const { saveTemplate, getTemplates, deleteTemplate, getTemplateById, updateTemplateById, getAllTemplates} = require('../controllers/templateController')

router.post('/', verifyUserToken, verifyUserRoles(ROLES_LIST.USER), saveTemplate);
router.get('/', verifyUserToken, verifyUserRoles(ROLES_LIST.USER), getTemplates);
router.get('/get-template/:id', verifyUserToken, verifyUserRoles(ROLES_LIST.USER), getTemplateById);
router.put('/:id', verifyUserToken, verifyUserRoles(ROLES_LIST.USER), updateTemplateById);
router.delete('/:id', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.USER), deleteTemplate);

router.get('/get-all-templates', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.SUPPORT, ROLES_LIST.SALES), getAllTemplates);

module.exports = router