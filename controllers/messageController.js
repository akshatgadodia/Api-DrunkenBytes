const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const Message = require("../models/Message");

const saveMessage = asyncHandler(async (req, res, next) => {
  await new Message({
    messageBy: req.body.messageBy || req.userId,
    subject: req.body.subject,
    type: req.body.type,
    message: req.body.message,
    date: new Date()
  }).save();
  res.status(200).json({
    success: true,
    data: {
      message: "Query Successfully Created"
    }
  });
});

const getMessages = asyncHandler(async (req, res, next) => {
  let searchParameter = {};
  // if (req.roles.includes(3894)) searchParameter = {type: "Editor"};
  // else if (req.roles.includes(7489)) searchParameter = { type: "Support" };
  const messages = await Message.find(searchParameter).limit(10).skip((req.query.currentPage-1)*10)
  .sort({ date: -1 })
  .populate({ path: "messageBy", select: ["name"] })
  .select({message:0, type:0});
  res.status(201).json({
    success: true,
    data: {
      messages: messages
    }
  });
});

const getMessageById = asyncHandler(async (req, res, next) => {
  const message = await Message.find({ _id: req.params.messageId });
  res.status(201).json({
    success: true,
    data: {
      message: message
    }
  });
});

module.exports = { saveMessage, getMessages, getMessageById };
