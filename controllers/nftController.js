const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const { web3 } = require("../config/web3");
const {
  sendConfirmationMail,
  sendErrorMail,
  sendPendingMail
} = require("../utils/mail");
const { saveDataOnIPFS } = require("../utils/storeData");
const {
  ABI,
  CONTRACT_ADDRESS,
  ACCOUNT_ADDRESS
} = require("../utils/constants");

const verifyUser = asyncHandler(async (req, next) => {
  let user;
  if (req.roles.includes(1541) || req.roles.includes(7489)) {
    user = await User.findOne({ _id: req.body.createdBy });
  } else {
    user = await User.findOne({ _id: req.userId });
    if (!user) return next(new ErrorResponse("Invalid Access Token", 403));
  }
  if (user.walletBalance <= 0) {
    return next(new ErrorResponse("Plan Limit Exceeded", 403));
  }
  return true;
});

const signWeb3Transaction = async (res, next, dataToStore) => {
  try {
    const storedDataLink = await saveDataOnIPFS(dataToStore);
    const contract = await new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    const networkId = await web3.eth.net.getId();
    let tx;
    if (dataToStore.methodType === 0) {
      tx = await contract.methods.safeMint(
        dataToStore.buyerMetamaskAddress,
        storedDataLink
      );
    } else if (dataToStore.methodType === 1) {
      // tx = await contract.methods.safeMint(
      //   dataToStore.buyerMetamaskAddress,
      //   storedDataLink
      // );
    } else {
      // tx = await contract.methods.safeMint(
      //   dataToStore.buyerMetamaskAddress,
      //   storedDataLink
      // );
    }
    const data = tx.encodeABI();
    const gas = await tx.estimateGas({
      from: ACCOUNT_ADDRESS,
      to: CONTRACT_ADDRESS,
      data: data
    });
    const gasPrice = await web3.eth.getGasPrice();
    // const price = web3.utils.toHex(web3.utils.toWei('1', 'gwei'));
    const nonce = await web3.eth.getTransactionCount(
      ACCOUNT_ADDRESS,
      "pending"
    );
    const options = {
      to: contract.options.address,
      data,
      // gas: web3.utils.toHex(web3.utils.toWei("30000000", "wei")),
      gas,
      // gasPrice:price,
      gasPrice,
      nonce,
      chainId: networkId,
      value: 0
    };
    const signedTx = await web3.eth.accounts.signTransaction(
      options,
      process.env.METAMASK_SECRET_KEY
    );
    res.status(201).json({
      success: true,
      data: {
        message: "Request Accepted",
        txId: signedTx.transactionHash
      }
    });
    return signedTx;
  } catch (err) {
    console.log("SIGNING TRANSACTION FAILED");
    console.log(err);
    return next(new ErrorResponse("Some Error Occurred", 500));
  }
};

const sendSignedWeb3Transaction = async (signedTx, dataToStore) => {
  try {
    const receipt = await web3.eth.sendSignedTransaction(
      signedTx.rawTransaction
    );
    const transactionReceipt = await web3.eth.getTransactionReceipt(
      signedTx.transactionHash
    );
    // console.log(transactionReceipt);
    const tokenId = web3.utils.hexToNumber(
      transactionReceipt.logs[0].topics[3]
    );
    await sendConfirmationMail({
      ...dataToStore,
      tokenId,
      txId: receipt.transactionHash
    });
    const value =
      transactionReceipt.effectiveGasPrice * transactionReceipt.gasUsed;
    const transactionCost = await web3.utils.fromWei(value.toString(), "ether");
    return { result: "Success", tokenId, value: transactionCost };
  } catch (err) {
    if (
      err.message ===
      "Transaction was not mined within 750 seconds, please make sure your transaction was properly sent. Be aware that it might still be mined!"
    ) {
      console.log("TRANSACTION PENDING ON BLOCKCHAIN");
      console.log(err);
      await sendPendingMail({ ...dataToStore, txId: signedTx.transactionHash });
      return { result: "Pending", value: NaN };
    } else {
      console.log("NFT CREATION FAILED");
      console.log(err);
      await sendErrorMail({ ...dataToStore, txId: signedTx.transactionHash });
      return { result: "Failed", value: 0 };
    }
  }
};

const storeTransactionDataAndDecreaseUserBalance = async (req, data) => {
  try {
    const transactionData = {
      txId: data.txId,
      createdBy: data.createdBy,
      buyerName: data.buyerName,
      buyerEmail: data.buyerEmail,
      brandName: data.brandName,
      productName: data.productName,
      productId: data.productId,
      tokenId: data.tokenId,
      warrantyExpireDate: data.warrantyExpireDate,
      status: data.status,
      buyerMetamaskAddress: data.buyerMetamaskAddress,
      dateCreated: data.dateCreated,
      value: data.value,
      methodType: data.methodType
    };
    await new Transaction(transactionData).save();
    if (data.status !== "Failed") {
      await User.findOneAndUpdate(
        { _id: (req.roles.includes(1541) || req.roles.includes(7489)) ? req.body.createdBy : req.userId },
        { $inc: { walletBalance: -data.value } }
      );
    }
  } catch (err) {
    console.log("Transactions Details Pushing Failed");
    console.log(err);
  }
};

const processNFT = async (req, res, next) => {
  //Verifying the limit or authenticity
  const verifyResult = await verifyUser(req, next);
  if (verifyResult) {
    //Creating Data Object
    const dataToStore = {
      sellerEmail: req.body.sellerEmail,
      sellerName: req.body.sellerName,
      buyerName: req.body.buyerName,
      buyerEmail: req.body.buyerEmail,
      brandName: req.body.brandName,
      productName: req.body.productName,
      productId: req.body.productId,
      warrantyExpireDate: req.body.warrantyExpireDate,
      buyerMetamaskAddress: req.body.buyerMetamaskAddress,
      accountAddress: req.userMetamask,
      methodType: 0
    };
    //Generating and Signing Web3 Transaction
    const signedTx = await signWeb3Transaction(res, next, dataToStore);
    //Sending Web3 Transaction to Blockchain
    const { result, tokenId, value } = await sendSignedWeb3Transaction(
      signedTx,
      dataToStore
    );
    //Storing the result  on the database and decreasing the hits value
    await storeTransactionDataAndDecreaseUserBalance(req, {
      ...dataToStore,
      txId: signedTx.transactionHash,
      tokenId,
      status: result,
      createdBy:  (req.roles.includes(1541) || req.roles.includes(7489)) ? req.body.createdBy :req.userId,
      dateCreated: new Date(),
      value
    });
  }
};

module.exports = { processNFT };
