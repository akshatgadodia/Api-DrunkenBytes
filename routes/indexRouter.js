const express = require("express");
const router = express.Router();

//User Route
const userRoutes = require("./userRoute");
router.use("/v1/user", userRoutes);
//Support User Route
const supportUserRoutes = require("./supportUserRoute");
router.use("/v1/support-user", supportUserRoutes);
//NFT Route
const nftRoutes = require("./nftRoute");
router.use("/v1/nft", nftRoutes);
//NFT Transaction Routes
const nftTransactionRoutes = require("./nftTransactionRoute");
router.use("/v1/nft-transaction", nftTransactionRoutes);
//Wallet Recharge Transaction Routes
const walletTransactionRoutes = require("./walletTransactionRoute");
router.use("/v1/wallet-transaction", walletTransactionRoutes);
//Api Key Routes
const apiKeyRoutes = require("./apiKeyRoute");
router.use("/v1/api-key", apiKeyRoutes);
//Admin Dashboard
const adminDashboardRoute = require("./adminDashboardRoute");
router.use("/v1/admin-dashboard", adminDashboardRoute);
//Message Router
const messageRoute = require("./messageRoute");
router.use("/v1/message", messageRoute);

module.exports = router;
