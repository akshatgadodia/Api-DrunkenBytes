const express = require('express')
const router = express.Router();

const { saveImage, deleteImage } = require('../controllers/imageController')

router.post('/upload-image', saveImage);
router.delete('/delete-image', deleteImage);

module.exports = router