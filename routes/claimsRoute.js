const express = require('express')
const router = express.Router()
const { getNFTData } = require('../controllers/claimsController')

router.get('/get-nft-details/:tokenId', getNFTData);

module.exports = router