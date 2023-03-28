const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
var jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiKey = require("../models/ApiKey");
const NftTransaction = require("../models/NftTransaction");
const Issue = require("../models/Issue");
const Product = require("../models/Product");

const { v4: uuidv4 } = require('uuid');
const { web3 } = require("../config/web3");

const initialLoginUser = asyncHandler(async (req, res, next) => {
  const accountAddress = req.body.accountAddress;
  let user = await User.findOne({ accountAddress });
  if (!user){ 
    res.status(201).json({
      success: true,
      data: {
        message: "Business Not Found"
      }
    });
  return null;
  }
  if (!user.verified){ 
    res.status(201).json({
      success: true,
      data: {
        message: "User Not Verified"
      }
    });
  return null;
  }
  const message = `
Welcome to Drunken Bytes!\n
Click to sign in and accept the OpenSea Terms of Service: https://drunkenbytes.vercel.app/terms-of-service\n
This request will not trigger a blockchain transaction or cost any gas fees.\n
Your authentication status will reset after you close the browser.\n
Wallet address:
${accountAddress}\n
Nonce:
${uuidv4()}
  `
  res.status(200).json({
    success: true,
    data: {
      message
    }
  });
});

const loginUser = asyncHandler(async (req, res, next) => {
  const recoveredAddress = await web3.eth.accounts.recover(req.body.message.toString(), req.body.signedData.toString());
  if (recoveredAddress !== req.body.accountAddress) return next(new ErrorResponse("Invalid User", 403));;
  const user = await User.findOne({ accountAddress: req.body.accountAddress });
  if (!user) return next(new ErrorResponse("Business Not Found", 404));
  const roles = Object.values(user.roles);
  const accessToken = jwt.sign(
    {
      UserInfo: {
        user: user.accountAddress,
        userId: user._id,
        userMetamask: user.accountAddress,
        roles: roles
      }
    },
    process.env.D_B_SECRET_KEY,
    { expiresIn: "7d" }
  );
  res.cookie("db_userAccessToken", accessToken, {
    // expires: new Date(Date.now() + ( 7 * 24 * 60 * 60 * 1000)),
    secure: true, // set to true if your using https or samesite is none
    sameSite: 'none', // set to none for cross-request
    httpOnly: true
  });
  res.status(200).json({
    success: true,
    data: { message: "Successfully Logged In", accessToken }
  });
});

const logoutUser = asyncHandler(async (req, res, next) => {
  res.clearCookie('userAccessToken');
  res.status(200).json({
    success: true,
    data: { message: "Successfully Logged Out" }
  });
});

const updateUserData = asyncHandler(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { _id: req.userId },
    req.body
  );
  console.log(user)
  res.status(200).json({
    success: true,
    data: { message: "User Data Successfully updated" }
  });
});


const getUser = asyncHandler(async (req, res, next) => {
  const userId = req.query.userId;
  const user = await User.findOne({ _id: userId });
  res.status(200).json({
    success: true,
    data: {
      user
    }
  });
});

const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ _id: req.userId });
  const apiKey = await ApiKey.countDocuments({createdBy: req.userId});
  const nft = await NftTransaction.countDocuments({createdBy: req.userId});
  const pendingTransactions = await NftTransaction.countDocuments({createdBy: req.userId, status: "pending"});
  const totalIssues = await Issue.countDocuments({issueFor: req.userId});
  const solvedIssues = await Issue.countDocuments({issueFor: req.userId, isSolved: true});
  const templates = await Product.countDocuments({createdBy: req.userId});
  const result = await NftTransaction.find({createdBy: req.userId}).sort({dateCreated: -1});
  const value = result.reduce((accumulator, transaction) => accumulator + transaction.value, 0);
  res.status(200).json({
    success: true,
    data: {
      user,
      pendingTransactions,
      apiKey,
      totalIssues,
      solvedIssues,
      activeIssues: totalIssues-solvedIssues,
      lastTransactionValue: result[0]?.value,
      nft,
      templates,
      value
    }
  });
});

const getAllUsers = asyncHandler(async (req, res, next) => {
  const { q, page, size } = req.query;
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
  const users = await User.find({ $and: searchParameters })
    .skip((page - 1) * size)
    .limit(size)
  const totalUsers = await User.countDocuments({ $and: searchParameters });
  res.status(200).json({
    success: true,
    data: {
      users,
      totalUsers
    }
  });
});

const saveUserRegisterRequest = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({accountAddress: req.body.accountAddress});
  if(user?.accountAddress) return next(new ErrorResponse("User Already Exists", 409));;
  const data = {
    ...req.body,
    roles: {
      USER: 6541
    }
  };
  await new User(data).save();
  res.status(200).json({
    success: true,
    data: {
      message: "Registration Request Successfully Accepted"
    }
  });
});
module.exports = { loginUser, updateUserData, getUser, getAllUsers, logoutUser, initialLoginUser, saveUserRegisterRequest, getUserProfile };
