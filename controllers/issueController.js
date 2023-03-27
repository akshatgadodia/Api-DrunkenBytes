const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const NftTransaction = require("../models/NftTransaction");
const Issue = require("../models/Issue");

const saveIssue = asyncHandler(async (req, res, next) => {
  const transaction = await NftTransaction.findOne({tokenId: req.body.tokenId})
  if(!transaction) return next(new ErrorResponse("Invalid Token ID", 404));
  const issue = await Issue.findOne({tokenId: req.body.tokenId})
  if(issue) return next(new ErrorResponse("Issue Already Raised for this Token ID", 403));
  await new Issue({
    issueFor: transaction.createdBy,
    tokenId: req.body.tokenId,
    txId: transaction.txId,
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
    date: new Date()
  }).save();
  res.status(201).json({
    success: true,
    data: {
      message: "Issue Raised Successfully",
    }
  });
});

const solveIssue = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  await Issue.findByIdAndUpdate(id, { isSolved: true }, { new: true });
  res.status(201).json({
    success: true,
    data: {
      message: "Issue Marked Solved",
    }
  });
});

const getIssue = asyncHandler(async (req, res, next) => {
  const issue = await Issue.findOne({ tokenId: req.params.tokenId });
  if(!issue) return next(new ErrorResponse("No Issue Found for this Token ID", 404));
  res.status(200).json({
    success: true,
    data: {
      issue
    }
  });
});

const getAllIssues = asyncHandler(async (req, res, next) => {
  const createdBy = req.userId;
  const { q, page, size } = req.query;
  let searchParameters = [];
  if (q !== "{}" && q !== "") {
    const queryParameters = q.split(",");
    queryParameters.forEach(element => {
      const queryParam = JSON.parse(element);
      const key = Object.keys(queryParam)[0];
      const value = Object.values(queryParam)[0];
      if (key === "tokenId") searchParameters.push({ [key]: value });
      else searchParameters.push({ [key]: { $regex: ".*" + value + ".*" } });
    });
  }
  searchParameters.push({
    issueFor: createdBy
  });
  const issues = await Issue.find({ $and: searchParameters })
    .skip((page - 1) * size)
    .limit(size);
  const totalIssues = await Issue.countDocuments({
    $and: searchParameters
  });
  res.status(200).json({
    success: true,
    data: {
      issues,
      totalIssues
    }
  });
});

module.exports = { saveIssue, getIssue, getAllIssues, solveIssue };
