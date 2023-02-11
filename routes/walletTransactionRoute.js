const express = require("express");
const router = express.Router();
const verifyUserToken = require("../middlewares/verifyUserToken")
const verifyUserRoles = require("../middlewares/verifyUserRoles")
const ROLES_LIST = require("../utils/rolesList")
const {verifyTransaction, getTransactions, getTransactionsByUserID, getAllTransactions, getTransaction} = require("../controllers/walletTransactionController");

// router.get("/get-transactions", verifyUserToken, verifyUserRoles(ROLES_LIST.USER), getTransactions);
router.get("/get-transactions", getTransactions);
router.get("/get-transaction", getTransaction);
router.get("/get-all-transactions", getAllTransactions);
router.get("/get-user-transactions", verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.SUPPORT), getTransactionsByUserID);
router.post("/verify-transaction", verifyTransaction);
// router.post("/repeat-transaction", verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.SUPPORT), repeatTransaction);

module.exports = router;
