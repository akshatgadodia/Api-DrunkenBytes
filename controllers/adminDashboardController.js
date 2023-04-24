const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const NftTransaction = require("../models/NftTransaction");

const getPerformanceData = asyncHandler(async (req, res, next) => {
  const [businessServed, nftsCreated, netTransactionValue] = await Promise.all([
    User.countDocuments({}),
    NftTransaction.countDocuments({ status: "Success", transactionType: "Mint" }),
    NftTransaction.aggregate([
      { $match: { status: "Success", transactionType: "Mint" } },
      { $group: { _id: null, total: { $sum: "$value" } } },
    ]).then((result) => result[0]?.total || 0), // handle empty result
  ]);
  res.status(201).json({
    success: true,
    data: {
      businessServed,
      nftsCreated,
      netTransactionValue
    }
  });
});

module.exports = { getPerformanceData };
