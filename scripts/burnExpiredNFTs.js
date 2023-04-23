const { web3 } = require("../config/web3");
const NftTransaction = require("../models/NftTransaction");
const { ABI, CONTRACT_ADDRESS } = require("../utils/constants");
const { sendBurnMail } = require("../utils/mail");
const logger = require("../config/logger");

const burnExpiredNFTs = async () => {
  const transactions = await NftTransaction.find({ burnAfter: { $lt: Date.now() } }).populate({ path: "createdBy", select: ["name", "email"] });;
  const contract = await new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
  const networkId = await web3.eth.net.getId();
  transactions.forEach(async (trans) => {
    let tx = await contract.methods.burnByDeleting(trans.tokenId);
    let r = await NftTransaction.deleteOne({ tokenId: trans.tokenId });
  });
};

module.exports = { burnExpiredNFTs };
