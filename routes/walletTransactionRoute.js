const express = require("express");
const router = express.Router();
const verifyUserToken = require("../middlewares/verifyUserToken")
const verifyUserRoles = require("../middlewares/verifyUserRoles")
const ROLES_LIST = require("../utils/rolesList")
const {verifyTransaction, getTransactions, getAllTransactions, getTransaction} = require("../controllers/walletTransactionController");

router.get("/get-transaction", getTransaction);

router.get("/get-transactions", verifyUserToken, verifyUserRoles(ROLES_LIST.USER), getTransactions);

router.get("/get-all-transactions", verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.SUPPORT), getAllTransactions);
router.post("/verify-transaction", verifyUserToken, verifyUserRoles(ROLES_LIST.USER), verifyTransaction);

module.exports = router;
