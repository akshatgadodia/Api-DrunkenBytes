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
  req.body = Object.assign(transactionData);
  await processNFT(req, res, next);
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
      if (key === "tokenId") searchParameters.push({ [key]: value });
      else searchParameters.push({ [key]: { $regex: ".*" + value + ".*" } });
    });
  }
  searchParameters.push({
    createdBy: createdBy
  });
  const transactions = await NftTransaction.find({ $and: searchParameters })
    .skip((page - 1) * size)
    .limit(size);
  const totalTransactions = await NftTransaction.countDocuments({
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
  const transactions = await NftTransaction.find({ $and: searchParameters })
    .skip((page - 1) * size)
    .limit(size);
  const totalTransactions = await NftTransaction.countDocuments({
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
  const transactions = await NftTransaction.find({ $and: searchParameters })
    .skip((page - 1) * size)
    .limit(size)
    .populate({ path: "createdBy", select: ["name", "_id"] });
  const totalTransactions = await NftTransaction.countDocuments({
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
  const transaction = await NftTransaction.findOne({ txId }).populate({
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
  repeatTransaction,
  getTransactions,
  getTransactionsByUserID,
  getAllTransactions,
  getTransaction
};
