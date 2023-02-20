const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
var jwt = require("jsonwebtoken");
const User = require("../models/User");
const { v4: uuidv4 } = require('uuid');
const { web3 } = require("../config/web3");

const initialLoginUser = asyncHandler(async (req, res, next) => {
  const accountAddress = req.body.accountAddress;
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
  let user = await User.findOne({ accountAddress: req.body.accountAddress });
  if (!user) {
    const data = {
      ...req.body,
      roles: {
        USER: 6541
      }
    };
    user = await new User(data).save();
  }
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
  res.cookie("userAccessToken", accessToken, {
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
module.exports = { loginUser, updateUserData, getUser, getAllUsers, logoutUser, initialLoginUser };
