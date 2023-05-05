const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
var jwt = require("jsonwebtoken");
const SupportUser = require("../models/SupportUser");
const { ACCOUNT_ADDRESS } = require('../utils/constants');
const bcrypt = require('bcryptjs');

const registerSupportUser = asyncHandler(async (req, res, next) => {
  let supportUser = await SupportUser.findOne({ email: req.body.email });
  if(supportUser){
    return next(new ErrorResponse("Support User Already Exists", 409));
  }
  const type = req.body.type.toUpperCase();
  let roles;
  if (type === "EDITOR") {
    roles = {
      EDITOR: 3894
    };
  }
  if (type === "SUPPORT") {
    roles = {
      SUPPORT: 7489
    };
  }
  if (type === "SALES") {
    roles = {
      SALES: 8458,
    };
  }
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    roles: roles
  };
  await new SupportUser(data).save();
  res.status(201).json({
    success: true,
    data: { message: `${type} Role Support User Created Successfully` }
  });
});

const loginSupportUser = asyncHandler(async (req, res, next) => {
  let supportUser = await SupportUser.findOne({ email: req.body.email });
  if (!supportUser) {
    return next(new ErrorResponse("Support User Not Found", 404));
  }
  let accessToken;
  const roles = Object.values(supportUser.roles);
  if (await bcrypt.compare(req.body.password, supportUser.password)) {
    accessToken = jwt.sign(
      {
        UserInfo: {
          user: supportUser.email,
          userId: supportUser._id,
          userMetamask: ACCOUNT_ADDRESS,
          roles: roles
        }
      },
      process.env.D_B_SECRET_KEY,
      { expiresIn: "7d" }
    );
    let role;
    if(roles.includes(1541)){
      role = "ADMIN"
    }
    else if(roles.includes(3894)){
      role = "EDITOR"
    }
    else if(roles.includes(7489)){
      role = "SUPPORT"
    }
    else if(roles.includes(8458)){
      role = "SALES"
    }
    else{
      role = "USER"
    }
    res.cookie("db_s_userAccessToken", accessToken, {
      expires: new Date(Date.now() + ( 7 * 24 * 60 * 60 * 1000)),
      secure: true, // set to true if your using https or samesite is none
      sameSite: 'none', // set to none for cross-request
      httpOnly: true
    });
    res.status(200).json({
      success: true,
      data: { message: "Successfully Logged In", role }
    });
  } else {
    return next(new ErrorResponse("Invalid Login Details", 401));
  }
});

const getSupportUserProfile = asyncHandler(async (req, res, next) => {
  const supportUser = await SupportUser.findOne({ _id: req.userId });
  res.status(200).json({
    success: true,
    data: {
      supportUser,
    }
  });
});

const logoutSupportUser = asyncHandler(async (req, res, next) => {
  res.clearCookie('db_s_userAccessToken');
  res.status(200).json({
    success: true,
    data: { message: "Successfully Logged Out" }
  });
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const supportUser = await SupportUser.findOne({ _id: req.userId });
  // Check if the current password is correct
  const isPasswordMatch = await bcrypt.compare(currentPassword, supportUser.password);
  if (!isPasswordMatch) {
    return next(new ErrorResponse("Current password is incorrect", 401));
  }
  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  // Update the user's password in the database
  await SupportUser.findByIdAndUpdate(req.userId, { password: hashedPassword });
  res.status(200).json({
    success: true,
    data: { message: "Password updated successfully" }
  });
});

const getSupportUser = asyncHandler(async (req, res, next) => {
  const supportUserId = req.query.supportUserId;
  const supportUser = await SupportUser.findOne({ _id: supportUserId });
  res.status(200).json({
    success: true,
    data: {
      supportUser
    }
  });
});

const getAllSupportUsers = asyncHandler(async (req, res, next) => {
  const { q, page, size } = req.query;
  let searchParameters = [];
  if (q !== "{}" && q !== "") {
    const queryParameters = q.split(",");
    queryParameters.forEach(element => {
      const queryParam = JSON.parse(element);
      const key = Object.keys(queryParam)[0];
      const value = Object.values(queryParam)[0];
      if(key === "roles") searchParameters.push({ [`${key}.${value}`]: { $exists: true } });
      else searchParameters.push({ [key]: { $regex: ".*" + value + ".*" } });
    });
  }
  const supportUsers = await SupportUser.find({ $and: searchParameters })
    .skip((page - 1) * size)
    .limit(size).sort({name: 1});
  const totalSupportUsers = await SupportUser.countDocuments({ $and: searchParameters });
  res.status(200).json({
    success: true,
    data: {
      supportUsers,
      totalSupportUsers
    }
  });
});

module.exports = {
  registerSupportUser,
  loginSupportUser,
  logoutSupportUser,
  getSupportUserProfile,
  changePassword,
  getSupportUser,
  getAllSupportUsers
};
