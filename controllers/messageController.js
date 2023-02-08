const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const Message = require("../models/Message");

const saveMessage = asyncHandler(async (req, res, next) => {
  await new Message({
    messageBy: req.userId,
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
  const messages = await Message.find({})
    .select({ messageBy: 1, _id: 1, type: 1, subject: 1, date: 1 })
    .sort({ date: -1 });
  res.status(201).json({
    success: true,
    data: {
      messages: messages
    }
  });
});

const getMessageById = asyncHandler(async (req, res, next) => {
  const message = await Message.find({_id: req.params.messageId});
  res.status(201).json({
    success: true,
    data: {
      message: message
    }
  });
});

module.exports = { saveMessage, getMessages, getMessageById };
