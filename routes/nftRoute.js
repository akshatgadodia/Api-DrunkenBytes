const express = require('express')
const router = express.Router()
const verifyUserToken = require("../middlewares/verifyUserToken")
const verifyUserRoles = require("../middlewares/verifyUserRoles")
const ROLES_LIST = require("../utils/rolesList")
const { processNFT, estimateNFTGenerationCost } = require('../controllers/nftController')

router.post('/mint-nft', verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.USER), processNFT);
router.get('/get-nft-generation-cost', estimateNFTGenerationCost);

module.exports = router