const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const NftTransaction = require("../models/NftTransaction");
const { processNFT } = require("./nftController");

const addTransaction = async (data) => {
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
      methodType: data.methodType,
      commissionCharged: data.commissionCharged,
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

const getTransactions = asyncHandler(async (req, res, next) => {
  const createdBy = req.userId;
  const { filters, page, size, sort } = req.query;
  let searchParameters = [{ createdBy }];
  if (filters && filters !== "{}") {
    filters.split(",").map((element) => {
      const queryParam = JSON.parse(element);
      const key = Object.keys(queryParam)[0];
      const value = Object.values(queryParam)[0];
      if (key === "tokenId") searchParameters.push({ [key]: value });
      else if (key === "createdBy") searchParameters.push({ [key]: value });
      else if (key === "useCustomImage")
        searchParameters.push({ [key]: value });
      else if (key === "isTransferable")
        searchParameters.push({ [key]: value });
      else if (key === "isBurnable") searchParameters.push({ [key]: value });
      else if (key === "dateCreated")
        searchParameters.push({
          [key]: {
            $gte: `${value}T00:00:00.000Z`,
            $lt: `${value}T23:59:59.999Z`,
          },
        });
      else if (key === "burnAfter")
        searchParameters.push({
          [key]: {
            $gte: `${value}T00:00:00.000Z`,
          },
        });
      else searchParameters.push({ [key]: { $regex: ".*" + value + ".*" } });
    });
  }
  const [totalTransactions, transactions] = await Promise.all([
    NftTransaction.countDocuments({
      $and: searchParameters,
    }),
    NftTransaction.find({ $and: searchParameters })
      .skip((page - 1) * size)
      .limit(size)
      .sort(JSON.parse(sort)),
  ]);
  res.status(200).json({
    success: true,
    data: {
      transactions,
      totalTransactions,
    },
  });
});

const getAllTransactions = asyncHandler(async (req, res, next) => {
  const { filters, page, size, sort } = req.query;
  let searchParameters = [];
  if (filters && filters !== "{}") {
    filters.split(",").map((element) => {
      const queryParam = JSON.parse(element);
      const key = Object.keys(queryParam)[0];
      const value = Object.values(queryParam)[0];
      if (key === "tokenId") searchParameters.push({ [key]: value });
      else if (key === "createdBy") searchParameters.push({ [key]: value });
      else if (key === "useCustomImage")
        searchParameters.push({ [key]: value });
      else if (key === "isTransferable")
        searchParameters.push({ [key]: value });
      else if (key === "isBurnable") searchParameters.push({ [key]: value });
      else if (key === "dateCreated")
        searchParameters.push({
          [key]: {
            $gte: `${value}T00:00:00.000Z`,
            $lt: `${value}T23:59:59.999Z`,
          },
        });
      else if (key === "burnAfter")
        searchParameters.push({
          [key]: {
            $gte: `${value}T00:00:00.000Z`,
          },
        });
      else searchParameters.push({ [key]: { $regex: ".*" + value + ".*" } });
    });
  }
  const [totalTransactions, transactions] = await Promise.all([
    NftTransaction.countDocuments({
      $and: searchParameters,
    }),
    NftTransaction.find({ $and: searchParameters })
      .skip((page - 1) * size)
      .limit(size)
      .populate({ path: "createdBy", select: ["name", "_id"] })
      .sort(JSON.parse(sort)),
  ]);
  res.status(200).json({
    success: true,
    data: {
      transactions,
      totalTransactions,
    },
  });
});

const getTransaction = asyncHandler(async (req, res, next) => {
  const txId = req.query.transactionHash;
  const transaction = await NftTransaction.findOne({ txId }).populate({
    path: "createdBy",
    select: ["name", "_id"],
  });

  res.status(200).json({
    success: true,
    data: {
      transaction,
    },
  });
});

const getTransactionByTokenId = asyncHandler(async (req, res, next) => {
  const tokenId = req.query.tokenId;
  const transaction = await NftTransaction.findOne({ tokenId, transactionType: "Mint" });
  res.status(200).json({
    success: true,
    data: {
      transaction,
    },
  });
});

module.exports = {
  getTransactionByTokenId,
  addTransaction,
  repeatTransaction,
  getTransactions,
  getAllTransactions,
  getTransaction,
};
