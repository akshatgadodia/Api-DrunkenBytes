const express = require('express')
const router = express.Router()

//User Route
const userRoutes = require("./userRoute");
router.use("/api/user", userRoutes);
//Support User Route
const supportUserRoutes = require("./supportUserRoute");
router.use("/api/support-user", supportUserRoutes);
//NFT Route
const nftRoutes = require("./nftRoute");
router.use("/api/nft", nftRoutes)
//Transaction Routes
const transactionRoutes = require("./transactionRoute");
router.use("/api/transaction", transactionRoutes)
//Api Key Routes
const apiKeyRoutes = require("./apiKeyRoute");
router.use("/api/api-key", apiKeyRoutes)

module.exports = router