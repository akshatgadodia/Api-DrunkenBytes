const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const NftTransaction = require("../models/NftTransaction");
const { processNFT } = require("./nftController");

const addTransaction = async data => {
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
    await new NftTransaction(transactionData).save();
  } catch (err) {
    console.log("Transaction Storing Failed");
    console.log(err);
  }
};

const repeatTransaction = asyncHandler(async (req, res, next) => {
  const txId = req.body.txId;
  const transactionData = await NftTransaction.findOne({ txId });
  if (!transactionData)
    return next(new ErrorResponse("Invalid Transaction ID", 404));
  if (
    transactionData.status === "Success" ||
    transactionData.status === "Pending"
  )
    return next(
      new ErrorResponse(
        "Succeeded and Pending Transaction cannot be repeated",
        403
      )
    );
  // console.log(transactionData);
  req.body = Object.assign(transactionData);
  // console.log(req.body);
  await processNFT(req, res, next);
});

const getTransactionsByUserID = asyncHandler(async (req, res, next) => {
  const createdBy = req.body.userId;
  const transactions = await NftTransaction.find({ createdBy });
  res.status(200).json({
    success: true,
    data: {
      transactions
    }
  });
});

const getTransactions = asyncHandler(async (req, res, next) => {
  const createdBy = req.userId;
  const transactions = await NftTransaction.find({ createdBy });
  res.status(200).json({
    success: true,
    data: {
      transactions
    }
  });
});

const getAllTransactions = asyncHandler(async (req, res, next) => {
  const transactions = await NftTransaction.find({})
  .populate({ path: "createdBy", select: ["name", "_id"] });
  const totalTransactions = await NftTransaction.countDocuments({});
  res.status(200).json({
    success: true,
    data: {
      transactions,
      totalTransactions
    }
  });
});

const getTransaction = asyncHandler(async (req, res, next) => {
  const txId = req.query.transactionHash
  const transaction = await NftTransaction.findOne({ txId })
  .populate({ path: "createdBy", select: ["name", "_id"] });

  res.status(200).json({
    success: true,
    data: {
      transaction
    }
  });
});

module.exports = {
  addTransaction,
  repeatTransaction,
  getTransactions,
  getTransactionsByUserID,
  getAllTransactions,
  getTransaction
};
