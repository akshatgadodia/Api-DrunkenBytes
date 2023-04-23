const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
var jwt = require("jsonwebtoken");
const SupportUser = require("../models/SupportUser");
const { ACCOUNT_ADDRESS } = require('../utils/constants');

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

const logoutSupportUser = asyncHandler(async (req, res, next) => {
  res.clearCookie('db_s_userAccessToken');
  res.status(200).json({
    success: true,
    data: { message: "Successfully Logged Out" }
  });
});

module.exports = {
  registerSupportUser,
  loginSupportUser,
  logoutSupportUser
};
