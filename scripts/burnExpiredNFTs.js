const { web3 } = require("../config/web3");
const NftTransaction = require("../models/NftTransaction");
const {
  ABI,
  ACCOUNT_ADDRESS,
  CONTRACT_ADDRESS,
} = require("../utils/constants");
const { sendBurnMail } = require("../utils/mail");
const logger = require("../config/logger");

const burnExpiredNFTs = async () => {
  try {
    const transactions = await NftTransaction.find( {
      $and: [{burnAfter: { $lt: Date.now() }},{burnt: true}]
   }).populate({ path: "createdBy", select: ["name", "email"] });
   
    const contract = await new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    const networkId = await web3.eth.net.getId();
    transactions.forEach(async (transaction) => {
      let tx = await contract.methods.burnByDeleting(transaction._doc.tokenId);
      const data = tx.encodeABI();
      const gasPrice = await web3.eth.getGasPrice();
      const nonce = await web3.eth.getTransactionCount(ACCOUNT_ADDRESS, "pending");
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
        value: 0
      };
      const signedTx = await web3.eth.accounts.signTransaction(
        options,
        process.env.METAMASK_SECRET_KEY
      );
      console.log(signedTx.transactionHash);
      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      console.log(receipt)
      transaction._doc.txId = signedTx.transactionHash;
      transaction.burnt=true
      await transaction.save();
      sendBurnMail({...transaction._doc, sellerName: transaction.createdBy.name, sellerEmail: transaction.createdBy.email})
    });
  } catch (error) {
    logger.error(error.message || "Error burning expired nfts");
    console.error("Error burning expired nfts:", error);
  }
};

module.exports = { burnExpiredNFTs };
