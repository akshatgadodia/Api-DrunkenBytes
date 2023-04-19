const express = require("express");
const router = express.Router();
const verifyUserToken = require("../middlewares/verifyUserToken")
const verifyUserRoles = require("../middlewares/verifyUserRoles")
const ROLES_LIST = require("../utils/rolesList")
const {repeatTransaction, getTransactions, getAllTransactions, getTransaction, getTransactionByTokenId} = require("../controllers/nftTransactionController");

router.get("/get-transaction", getTransaction);

router.get("/get-transactions", verifyUserToken, verifyUserRoles(ROLES_LIST.USER), getTransactions);
router.get("/get-transaction-details", getTransactionByTokenId);

router.get("/get-all-transactions", verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.SUPPORT, ROLES_LIST.SALES), getAllTransactions);
router.post("/repeat-transaction", verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.SUPPORT), repeatTransaction);

module.exports = router;
