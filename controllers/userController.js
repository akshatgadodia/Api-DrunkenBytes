const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
var jwt = require("jsonwebtoken");
const User = require("../models/User");

const loginUser = asyncHandler(async (req, res, next) => {
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
  res.cookie("userAccessToken", accessToken,{
    // expires: new Date(Date.now() + ( 7 * 24 * 60 * 60 * 1000)),
    secure: true, // set to true if your using https or samesite is none
    sameSite: 'none', // set to none for cross-request
    httpOnly: true
  });
  res.cookie("userRole", "USER",{
    // expires: new Date(Date.now() + ( 7 * 24 * 60 * 60 * 1000)),
    secure: true, // set to true if your using https or samesite is none
    sameSite: 'none', // set to none for cross-request
  });
  res.status(200).json({
    success: true,
    data: { message: "Successfully Logged In", accessToken }
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
    data: {message: "User Data Successfully updated"}
  });
});

module.exports = { loginUser, updateUserData };
