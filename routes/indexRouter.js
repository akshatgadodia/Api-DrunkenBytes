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

//Admin Dashboard Routes
const adminDashboardRoute = require("./adminDashboardRoute");
router.use("/v1/admin-dashboard", adminDashboardRoute);

//Message Routes
const ticketRoute = require("./ticketRoute");
router.use("/v1/ticket", ticketRoute);

//Article Routes
const articleRoute = require("./articleRoute");
router.use("/v1/article", articleRoute);

//Image Routes
const imageRoute = require("./imageRoute");
router.use("/v1/image", imageRoute);

//Blog Routes
const blogRoute = require("./blogRoute");
router.use("/v1/blog", blogRoute);

//Template Routes
const templateRoute = require("./templateRoute");
router.use("/v1/template", templateRoute);

//Download Routes
const downloadRoute = require("./downloadRoute");
router.use("/v1/download", downloadRoute);

//Issues Routes
const issueRoute = require("./issueRoute");
router.use("/v1/issue", issueRoute);


module.exports = router;
