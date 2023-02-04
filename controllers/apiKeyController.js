const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
var jwt = require("jsonwebtoken");
const ApiKey = require("../models/ApiKey");
const uuid = require("uuid");
const generateAPIKey = asyncHandler(async (req, res, next) => {
  const apiKeyName = req.body.name || "API KEY";
  const generatedApiKey = uuid.v1();
  const accessToken = jwt.sign(
    {
      UserInfo: {
        user: generatedApiKey,
        userId: req.userId,
        userMetamask: req.userMetamask,
        roles: req.roles
      }
    },
    process.env.D_B_SECRET_KEY,
    { expiresIn: "60d" }
  );
  const expiryDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
  await new ApiKey({
    createdBy: req.userId,
    name: apiKeyName,
    apiKey: generatedApiKey,
    expiryDate
  }).save();
  res.status(201).json({
    success: true,
    data: {
      message: "API Key Created Successfully",
      name: apiKeyName,
      apiKey: generatedApiKey,
      expiryDate,
      accessToken
    }
  });
});

const deleteAPIKey = asyncHandler(async (req, res, next) => {
  // console.log(req.body);
  const apiKey = await ApiKey.findOne({apiKey: req.body.apiKey})
  if(!apiKey) return next(new ErrorResponse("API Key Not Found", 404));
  if(apiKey.createdBy.toString() !== req.userId) return next(new ErrorResponse("Permission Denied", 403));
  await ApiKey.deleteOne({apiKey: req.body.apiKey})
  res.status(204).json({
    success: true,
    data: {message : "API Key Deleted Successfully"}
  });
});

module.exports = { generateAPIKey, deleteAPIKey };
