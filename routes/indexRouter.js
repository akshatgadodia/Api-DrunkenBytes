const express = require('express')
const router = express.Router()

//User Route
const userRoutes = require("./userRoute");
router.use("/v1/user", userRoutes);
//Support User Route
const supportUserRoutes = require("./supportUserRoute");
router.use("/v1/support-user", supportUserRoutes);
//NFT Route
const nftRoutes = require("./nftRoute");
router.use("/v1/nft", nftRoutes)
//Transaction Routes
const transactionRoutes = require("./transactionRoute");
router.use("/v1/transaction", transactionRoutes)
//Api Key Routes
const apiKeyRoutes = require("./apiKeyRoute");
router.use("/v1/api-key", apiKeyRoutes)

module.exports = router