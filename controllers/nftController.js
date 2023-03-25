const asyncHandler = require("../middlewares/asyncHandler");
const mongoose = require("mongoose");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const NftTransaction = require("../models/NftTransaction");
const TokenId = require("../models/TokenId");
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
    if (user==null) return next(new ErrorResponse("Invalid Access Token", 403));
  }
  return { user, status: true };
});

const signWeb3Transaction = async (res, next, dataToStore, walletBalance) => {
  try {
    const storedDataLink = await saveDataOnIPFS(dataToStore);
    const contract = await new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    const networkId = await web3.eth.net.getId();
    let tx = await contract.methods.safeMint(
        dataToStore.receiverWalletAddress,
        dataToStore.tokenId,
        dataToStore.isTransferable,
        storedDataLink
      );
    const data = tx.encodeABI();
    const gas = await tx.estimateGas({
      from: ACCOUNT_ADDRESS,
      to: CONTRACT_ADDRESS,
      data: data
    });
    const gasPrice = await web3.eth.getGasPrice();
    // const price = web3.utils.toHex(web3.utils.toWei('1', 'gwei'));
    const transactionCost = gasPrice * gas;
    if (
      walletBalance <=
      (await web3.utils.fromWei(transactionCost.toString(), "ether"))
    ) {
      return next(new ErrorResponse("Insufficient Wallet Balance", 403));
    }
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
    // const tokenId = web3.utils.hexToNumber(
    //   transactionReceipt?.logs[0]?.topics[3]
    // );
    await sendConfirmationMail({
      ...dataToStore,
      txId: receipt.transactionHash
    });
    const value = transactionReceipt?.effectiveGasPrice * transactionReceipt?.gasUsed;
    const transactionCost = await web3.utils.fromWei(value.toString(), "ether");
    return { result: "Success", value: transactionCost };
  } catch (err) {
    if (
      err.message ===
      "Transaction was not mined within 750 seconds, please make sure your transaction was properly sent. Be aware that it might still be mined!"
    ) {
      console.log("TRANSACTION PENDING ON BLOCKCHAIN");
      console.log(err);
      await sendPendingMail({ ...dataToStore, txId: signedTx.transactionHash });
      return { result: "Pending", value: 0 };
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
      tokenId: data.tokenId,
      status: data.status,
      dateCreated: data.dateCreated,
      value: data.value,
      receiverName: data.receiverName,
      receiverEmail: data.receiverEmail,
      receiverWalletAddress: req.body.receiverWalletAddress,
      nftType: req.body.nftType,
      nftName: req.body.nftName,
      useCustomImage: req.body.useCustomImage,
      isTransferable: req.body.isTransferable,
      isBurnable: req.body.isBurnable,
      burnAfter: req.body.burnAfter,
      traits: req.body.traits,
    };
    await new NftTransaction(transactionData).save();
    if (data.status !== "Failed") {
      await User.findOneAndUpdate(
        {
          _id:
            req.roles.includes(1541) || req.roles.includes(7489)
              ? req.body.createdBy
              : req.userId
        },
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
  if(req.body.useCustomImage && (req.body.imageBase64 === undefined || req.body.imageBase64 === null)){
    return next(new ErrorResponse("Image Base 64 Not Available", 403));
  }
  const { user, status } = await verifyUser(req, next);
  if (status) {
    const session = await mongoose.startSession()
    let tokenId;
    try{
      await session.startTransaction();
      tokenId = await TokenId.findOneAndUpdate({}, { $inc: { value: 1 } }, { new: true, session, upsert: true });
      tokenId = tokenId.value;
      await session.commitTransaction();
    }
    catch(err){
      console.log(err);
      await session.abortTransaction();
      return next(new ErrorResponse("Internal Server Error", 500));
    }
    // Creating Data Object
    const dataToStore = {
      sellerEmail: user.email,
      sellerName: user.name,
      receiverName: req.body.receiverName,
      receiverEmail: req.body.receiverEmail,
      receiverWalletAddress: req.body.receiverWalletAddress,
      nftType: req.body.nftType,
      nftName: req.body.nftName,
      useCustomImage: req.body.useCustomImage,
      imageBase64: req.body.imageBase64,
      isTransferable: req.body.isTransferable,
      isBurnable: req.body.isBurnable,
      burnAfter: req.body.burnAfter,
      traits: req.body.traits,
      tokenId
    };
    //Generating and Signing Web3 Transaction
    const signedTx = await signWeb3Transaction(
      res,
      next,
      dataToStore,
      user.walletBalance
    );
    if (signedTx !== undefined) {
      //Sending Web3 Transaction to Blockchain
      const { result, value } = await sendSignedWeb3Transaction(
        signedTx,
        dataToStore
      );
      //Storing the result  on the database and decreasing the hits value
      await storeTransactionDataAndDecreaseUserBalance(req, {
        ...dataToStore,
        txId: signedTx.transactionHash,
        status: result,
        createdBy:
          req.roles.includes(1541) || req.roles.includes(7489)
            ? req.body.createdBy
            : req.userId,
        dateCreated: new Date(),
        value
      });
    }
  }
};

const estimateNFTGenerationCost = async (req, res, next) => {
  const gasPrice = await web3.eth.getGasPrice();
  const transactionCost = await web3.utils.fromWei((gasPrice * 152122).toString(), "ether");
  res.status(201).json({
    success: true,
    data: {
      transactionCost
    }
  });
}

module.exports = { processNFT, estimateNFTGenerationCost };
