const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const getPerformanceData = asyncHandler(async (req, res, next) => {
  // console.log(req.body);
  const users = await User.countDocuments({});
  const nfts = await Transaction.countDocuments({status: "Success"});
  const values = await Transaction.countDocuments({status: "Success"});
  res.status(201).json({
    success: true,
    data: {
      businessServed : users,
      nftsCreated: nfts,
      netTransactionValue: values
    }
  });
});

module.exports = { getPerformanceData };