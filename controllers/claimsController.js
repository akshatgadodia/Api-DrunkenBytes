const mongoose = require("mongoose");
const NftTransaction = require("../models/NftTransaction")
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");

const getNFTData = asyncHandler(async (req, res, next) => {
  const tokenId = req.params.tokenId;
  const transaction = await NftTransaction.findOne({tokenId})
  if(new Date().getTime() > new Date(transaction.warrantyExpireDate).getTime()){
    return next(new ErrorResponse("Warranty Expired", 403));
  }
  res.status(201).json({
    success: true,
    data: {
      transaction
    }
  });
});


module.exports = { getNFTData };
