const NftTransaction = require("../models/NftTransaction");
const { web3 } = require("../config/web3");
const { sendConfirmationMail } = require("../utils/mail");
const logger = require("../config/logger");

const resolvePendingTransactions = async () => {
  try {
    const pendingTransactions = await NftTransaction.find({status: "Pending"}).populate({ path: "createdBy", select: ["name", "email"] });
    pendingTransactions.forEach(async (transaction) => {
      const transactionReceipt = await web3.eth.getTransactionReceipt(transaction.txId);
      if (transactionReceipt) {
        const value = transactionReceipt?.effectiveGasPrice * transactionReceipt?.gasUsed;
        const transactionCost = await web3.utils.fromWei(value.toString(),"ether");
        transaction.status = "Success";
        transaction.value = transactionCost;
        await transaction.save();
        await sendConfirmationMail({...transaction._doc, sellerName: transaction.createdBy.name, sellerEmail: transaction.createdBy.email});
      }
    })
  } catch (error) {
    logger.error(error.message || "Error resolving pending transactions");
    console.error("Error resolving pending transactions:", error);
  }
};

module.exports = { resolvePendingTransactions };
