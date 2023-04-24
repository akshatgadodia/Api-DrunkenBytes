const { web3 } = require("../config/web3");
const NftTransaction = require("../models/NftTransaction");
const {
  ABI,
  ACCOUNT_ADDRESS,
  CONTRACT_ADDRESS,
} = require("../utils/constants");
const { sendBurnMail } = require("../utils/mail");
const logger = require("../config/logger");
const User = require("../models/User");

const burnExpiredNFTs = async () => {
  try {
    const transactions = await NftTransaction.find({
      $and: [{ burnAfter: { $lt: Date.now() } }, { burned: true }],
    }).populate({ path: "createdBy", select: ["name", "email"] });

    const contract = await new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    const networkId = await web3.eth.net.getId();
    transactions.forEach(async (transaction) => {
      let tx = await contract.methods.burnByDeleting(transaction._doc.tokenId);
      const data = tx.encodeABI();
      const gasPrice = await web3.eth.getGasPrice();
      const nonce = await web3.eth.getTransactionCount(
        ACCOUNT_ADDRESS,
        "pending"
      );
      const gas = await tx.estimateGas({
        from: ACCOUNT_ADDRESS,
        to: CONTRACT_ADDRESS,
        data: data,
      });
      const options = {
        to: contract.options.address,
        data,
        gas,
        gasPrice,
        nonce,
        chainId: networkId,
        value: 0,
      };
      const signedTx = await web3.eth.accounts.signTransaction(
        options,
        process.env.METAMASK_SECRET_KEY
      );
      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      transaction.burned = true;
      await transaction.save();

      const burnedTransaction = transaction._doc;
      burnedTransaction.txId = signedTx.transactionHash;
      burnedTransaction.burned = true;
      burnedTransaction.dateCreated = new Date();
      burnedTransaction.transactionType = "Burn";
      let transactionCost = gasPrice * gas;
      const user = await User.findOne({ _id: transaction._doc.createdBy._id });
      transactionCost = Math.round(
        transactionCost * (1 + user.commissionPercent / 100)
      );
      transactionCost = await web3.utils.fromWei(
        transactionCost.toString(),
        "ether"
      );
      burnedTransaction.value = transactionCost;
      delete burnedTransaction._id;
      await new NftTransaction(burnedTransaction).save();
      await User.findOneAndUpdate(
        {
          _id: transaction._doc.createdBy._id,
        },
        { $inc: { walletBalance: -transactionCost } }
      );

      sendBurnMail({
        ...transaction._doc,
        sellerName: transaction.createdBy.name,
        sellerEmail: transaction.createdBy.email,
      });
    });
  } catch (error) {
    logger.error(error.message || "Error burning expired nfts");
    console.error("Error burning expired nfts:", error);
  }
};

module.exports = { burnExpiredNFTs };
