const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const WalletTransaction = require("../models/WalletTransaction");
const { web3 } = require("../config/web3");
const User = require("../models/User");

const addTransaction = asyncHandler(async data => {
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
});

const verifyTransaction = asyncHandler(async (req, res, next) => {
  const txId = req.body.txId;
  const transactionReceipt = await web3.eth.getTransactionReceipt(txId);
  if(!transactionReceipt?.status) 
    return next(new ErrorResponse("Transaction Failed",401));
  if(transactionReceipt?.from.toLowerCase() !== req.user.toLowerCase()) 
    return next(new ErrorResponse("Transaction is not originated from your account",401));
  if(transactionReceipt?.to.toLowerCase() !== "0xdCFF746b4EBa3446c2ec3794A0961785c7c93013".toLowerCase()) 
    return next(new ErrorResponse("Transaction is not received to our account",401));
  const transaction = await web3.eth.getTransaction(txId);
  const updatedValue = await web3.utils.fromWei(transaction.value, "ether");
  await User.findOneAndUpdate(
    {
      _id:req.userId
    },
    { $inc: { walletBalance: +updatedValue } }
  );
  await new WalletTransaction({
    createdBy: req.userId,
    txId,
    status: "Success",
    dateCreated: new Date(),
    value: Number(updatedValue)
  }).save();
  res.status(200).json({
    success: true,
    data: {
      message: "Balance Successfully Added"
    }
  });
});

const getTransactionsByUserID = asyncHandler(async (req, res, next) => {
  const { q, createdBy, page, size } = req.query;
  let searchParameters = [];
  if (q !== "{}" && q !== "") {
    const queryParameters = q.split(",");
    queryParameters.forEach(element => {
      const queryParam = JSON.parse(element);
      const key = Object.keys(queryParam)[0];
      const value = Object.values(queryParam)[0];
      searchParameters.push({ [key]: { $regex: ".*" + value + ".*" } });
    });
  }
  searchParameters.push({
    createdBy: createdBy
  });
  const transactions = await WalletTransaction.find({ $and: searchParameters })
    .skip((page - 1) * size)
    .limit(size);
  const totalTransactions = await WalletTransaction.countDocuments({
    $and: searchParameters
  });
  res.status(200).json({
    success: true,
    data: {
      transactions,
      totalTransactions
    }
  });
});

const getTransactions = asyncHandler(async (req, res, next) => {
  const createdBy = req.userId;
  const { q, page, size } = req.query;
  let searchParameters = [];
  if (q !== "{}" && q !== "") {
    const queryParameters = q.split(",");
    queryParameters.forEach(element => {
      const queryParam = JSON.parse(element);
      const key = Object.keys(queryParam)[0];
      const value = Object.values(queryParam)[0];
      if (key === "tokenId") searchParameters.push({ [key]: value });
      else searchParameters.push({ [key]: { $regex: ".*" + value + ".*" } });
    });
  }
  searchParameters.push({
    createdBy: createdBy
  });
  const transactions = await WalletTransaction.find({ $and: searchParameters })
    .skip((page - 1) * size)
    .limit(size);
  const totalTransactions = await WalletTransaction.countDocuments({
    $and: searchParameters
  });

  res.status(200).json({
    success: true,
    data: {
      transactions,
      totalTransactions
    }
  });
});

const getAllTransactions = asyncHandler(async (req, res, next) => {
  const { q, page, size } = req.query;
  let searchParameters = [];
  if (q !== "{}" && q !== "") {
    const queryParameters = q.split(",");
    queryParameters.forEach(element => {
      const queryParam = JSON.parse(element);
      const key = Object.keys(queryParam)[0];
      const value = Object.values(queryParam)[0];
      if (key === "tokenId") searchParameters.push({ [key]: value });
      else searchParameters.push({ [key]: { $regex: ".*" + value + ".*" } });
    });
  }
  const transactions = await WalletTransaction.find({ $and: searchParameters })
    .skip((page - 1) * size)
    .limit(size)
    .populate({ path: "createdBy", select: ["name", "_id"] });
  const totalTransactions = await WalletTransaction.countDocuments({
    $and: searchParameters
  });
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
