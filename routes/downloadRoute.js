const express = require('express')
const router = express.Router()
const { downloadImagesFolder, downloadLogFiles } = require('../controllers/downloadController')

router.get('/download-images-folder', downloadImagesFolder);
router.get('/download-log-files', downloadLogFiles);

module.exports = router