const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const NftTransaction = require("../models/NftTransaction");
const Issue = require("../models/Issue");

const saveIssue = asyncHandler(async (req, res, next) => {
  const [transaction, issue] = await Promise.all([
    NftTransaction.findOne({ tokenId: req.body.tokenId, transactionType: "Mint" }),
    Issue.findOne({ tokenId: req.body.tokenId }),
  ]);
  if (!transaction) return next(new ErrorResponse("Invalid Token ID", 404));
  if (transaction.burned) return next(new ErrorResponse("Cannot Raise Issue for a burned NFT", 403));
  if (issue)
    return next(
      new ErrorResponse("Issue Already Raised for this Token ID", 403)
    );
  await new Issue({
    issueFor: transaction.createdBy,
    tokenId: req.body.tokenId,
    txId: transaction.txId,
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
  }).save();
  res.status(201).json({
    success: true,
    data: {
      message: "Issue Raised Successfully",
    },
  });
});

const solveIssue = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const updatedIssue = await Issue.findByIdAndUpdate(
    id,
    { isSolved: true },
    { new: true }
  );
  if (!updatedIssue) {
    return next(new ErrorResponse("Issue not found", 404));
  }
  res.status(201).json({
    success: true,
    data: {
      message: "Issue Marked Solved",
    },
  });
});

const getIssue = asyncHandler(async (req, res, next) => {
  const issue = await Issue.findOne({ tokenId: req.params.tokenId });
  if (!issue)
    return next(new ErrorResponse("No Issue Found for this Token ID", 404));
  res.status(200).json({
    success: true,
    data: {
      issue,
    },
  });
});

const getIssues = asyncHandler(async (req, res, next) => {
  const issueFor = req.userId;
  const { filters, page, size, sort } = req.query;
  let searchParameters = [{ issueFor }];
  if (filters && filters !== "{}") {
    filters.split(",").map((element) => {
      const queryParam = JSON.parse(element);
      const key = Object.keys(queryParam)[0];
      const value = Object.values(queryParam)[0];
      if (key === "issueFor") searchParameters.push({ [key]: value });
      else if (key === "tokenId") searchParameters.push({ [key]: value });
      else if (key === "isSolved") searchParameters.push({ [key]: value });
      else if (key === "dateCreated")
        searchParameters.push({
          date: {
            $gte: `${value}T00:00:00.000Z`,
            $lt: `${value}T23:59:59.999Z`,
          },
        });
      else searchParameters.push({ [key]: { $regex: ".*" + value + ".*" } });
    });
  }
  const [totalIssues, issues] = await Promise.all([
    Issue.countDocuments({
      $and: searchParameters,
    }),
    Issue.find({ $and: searchParameters })
      .skip((page - 1) * size)
      .limit(size)
      .sort(JSON.parse(sort)),
  ]);
  res.status(200).json({
    success: true,
    data: {
      issues,
      totalIssues,
    },
  });
});

const getAllIssues = asyncHandler(async (req, res, next) => {
  const { filters, page, size, sort } = req.query;
  let searchParameters = [];
  if (filters && filters !== "{}") {
    filters.split(",").map((element) => {
      const queryParam = JSON.parse(element);
      const key = Object.keys(queryParam)[0];
      const value = Object.values(queryParam)[0];
      if (key === "issueFor") searchParameters.push({ [key]: value });
      else if (key === "tokenId") searchParameters.push({ [key]: value });
      else if (key === "isSolved") searchParameters.push({ [key]: value });
      else if (key === "dateCreated")
        searchParameters.push({
          date: {
            $gte: `${value}T00:00:00.000Z`,
            $lt: `${value}T23:59:59.999Z`,
          },
        });
      else searchParameters.push({ [key]: { $regex: ".*" + value + ".*" } });
    });
  }
  const [totalIssues, issues] = await Promise.all([
    Issue.countDocuments({
      $and: searchParameters,
    }),
    Issue.find({ $and: searchParameters })
      .skip((page - 1) * size)
      .limit(size)
      .populate({ path: "issueFor", select: ["name", "_id"] })
      .sort(JSON.parse(sort)),
  ]);
  res.status(200).json({
    success: true,
    data: {
      issues,
      totalIssues,
    },
  });
});

module.exports = { saveIssue, getIssue, getAllIssues, solveIssue, getIssues };
