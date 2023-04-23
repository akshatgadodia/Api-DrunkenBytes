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
        roles: req.roles,
      },
    },
    process.env.D_B_SECRET_KEY,
    { expiresIn: "364635d" }
  );
  await new ApiKey({
    createdBy: req.userId,
    name: apiKeyName,
    apiKey: generatedApiKey,
  }).save();
  res.status(201).json({
    success: true,
    data: {
      message: "API Key Created Successfully",
      name: apiKeyName,
      apiKey: generatedApiKey,
      accessToken,
    },
  });
});

const deleteAPIKey = asyncHandler(async (req, res, next) => {
  const key = req.params.key;
  const apiKey = await ApiKey.findOne({ apiKey: key });
  if (!apiKey) return next(new ErrorResponse("API Key Not Found", 404));
  if (apiKey.createdBy.toString() !== req.userId)
    return next(new ErrorResponse("Permission Denied", 403));
  await ApiKey.deleteOne({ apiKey: key });
  res.status(201).json({
    success: true,
    data: { message: "API Key Deleted Successfully" },
  });
});

const getApiKeys = asyncHandler(async (req, res, next) => {
  const createdBy = req.userId;
  const { filters, page, size, sort } = req.query;
  let searchParameters = [{ createdBy }];
  if (filters && filters !== "{}") {
    filters.split(",").map((element) => {
      const queryParam = JSON.parse(element);
      const key = Object.keys(queryParam)[0];
      const value = Object.values(queryParam)[0];
      searchParameters.push({ [key]: { $regex: ".*" + value + ".*" } });
    });
  }
  const [totalApiKeys, apiKeys] = await Promise.all([
    ApiKey.countDocuments({
      $and: searchParameters,
    }),
    ApiKey.find({ $and: searchParameters })
      .skip((page - 1) * size)
      .limit(size)
      .sort(JSON.parse(sort)),
  ]);
  res.status(200).json({
    success: true,
    data: {
      apiKeys,
      totalApiKeys,
    },
  });
});

const getAllApiKeys = asyncHandler(async (req, res, next) => {
  const { filters, page, size, sort } = req.query;
  let searchParameters = [];
  if (filters && filters !== "{}") {
    filters.split(",").map((element) => {
      const queryParam = JSON.parse(element);
      const key = Object.keys(queryParam)[0];
      const value = Object.values(queryParam)[0];
      if (key === "createdBy") searchParameters.push({ [key]: value });
      else searchParameters.push({ [key]: { $regex: ".*" + value + ".*" } });
    });
  }
  const [totalApiKeys, apiKeys] = await Promise.all([
    ApiKey.countDocuments({
      $and: searchParameters,
    }),
    ApiKey.find({ $and: searchParameters })
      .skip((page - 1) * size)
      .limit(size)
      .populate({ path: "createdBy", select: ["name", "_id"] })
      .sort(JSON.parse(sort)),
  ]);
  res.status(200).json({
    success: true,
    data: {
      apiKeys,
      totalApiKeys,
    },
  });
});

module.exports = { generateAPIKey, deleteAPIKey, getApiKeys, getAllApiKeys };
