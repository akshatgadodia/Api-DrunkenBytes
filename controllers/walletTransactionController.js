const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const WalletTransaction = require("../models/WalletTransaction");

const addTransaction = async data => {
  try {
    const transactionData = {
      txId: data.txId,
      createdBy: data.createdBy,
      status: data.status,
      dateCreated: data.dateCreated,
      value: data.value
    };
    await new WalletTransaction(transactionData).save();
  } catch (err) {
    console.log("Transaction Storing Failed");
    console.log(err);
  }
};

const verifyTransaction = asyncHandler(async (req, res, next) => {
  const txId = req.body.txId;
  const transactionData = await WalletTransaction.findOne({ txId });
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
  req.body = Object.assign(transactionData);
});

const getTransactionsByUserID = asyncHandler(async (req, res, next) => {
  const createdBy = req.body.userId;
  const transactions = await WalletTransaction.find({ createdBy });
  res.status(200).json({
    success: true,
    data: {
      transactions
    }
  });
});

const getTransactions = asyncHandler(async (req, res, next) => {
  const createdBy = req.userId;
  const transactions = await WalletTransaction.find({ createdBy });
  res.status(200).json({
    success: true,
    data: {
      transactions
    }
  });
});

const getAllTransactions = asyncHandler(async (req, res, next) => {
  const transactions = await WalletTransaction.find({}).populate({
    path: "createdBy",
    select: ["name", "_id"]
  });
  const totalTransactions = await WalletTransaction.countDocuments({});
  res.status(200).json({
    success: true,
    data: {
      transactions,
      totalTransactions
    }
  });
});

const getTransaction = asyncHandler(async (req, res, next) => {
  const txId = req.query.transactionHash;
  const transaction = await WalletTransaction.findOne({ txId }).populate({
    path: "createdBy",
    select: ["name", "_id"]
  });
  res.status(200).json({
    success: true,
    data: {
      transaction
    }
  });
});

module.exports = {
  addTransaction,
  verifyTransaction,
  getTransactions,
  getTransactionsByUserID,
  getAllTransactions,
  getTransaction
};
