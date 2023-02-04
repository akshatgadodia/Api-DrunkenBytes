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
