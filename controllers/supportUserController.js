const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
var jwt = require("jsonwebtoken");
const SupportUser = require("../models/SupportUser");
var bcrypt = require('bcryptjs');
const { ACCOUNT_ADDRESS } = require('../utils/constants');

const registerSupportUser = asyncHandler(async (req, res, next) => {
  let supportUser = await SupportUser.findOne({ email: req.body.email });
  if(supportUser){
    return next(new ErrorResponse("Support User Already Exists", 409));
  }
  const saltRounds = 10;
  const type = req.body.type.toUpperCase();
  let roles;
  if (type === "EDITOR") {
    roles = {
      USER: 6541,
      EDITOR: 3894
    };
  }
  if (type === "SUPPORT") {
    roles = {
      USER: 6541,
      SUPPORT: 7489
    };
  }
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, saltRounds),
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
    res.cookie("token",accessToken,{
      expires: new Date(Date.now() + (3600 * 1000 * 24 * 180 * 1)), //second min hour days year
      secure: true, // set to true if your using https or samesite is none
      // httpOnly: true, // backend only
      sameSite: 'none' // set to none for cross-request
    });
    res.status(200).json({
      success: true,
      data: { message: "Successfully Logged In", accessToken }
    });
  } else {
    return next(new ErrorResponse("Invalid Login Details", 401));
  }
});

module.exports = {
  registerSupportUser,
  loginSupportUser
};
