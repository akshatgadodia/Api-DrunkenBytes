const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const Template = require("../models/Template");

const saveTemplate = asyncHandler(async (req, res, next) => {
  await new Template({
    createdBy: req.userId,
    traits: req.body.traits,
    nftType: req.body.nftType,
    name: req.body.name,
  }).save();
  res.status(200).json({
    success: true,
    data: {
      message: "Template Successfully Created",
    },
  });
});

const getTemplates = asyncHandler(async (req, res, next) => {
  const createdBy = req.userId;
  const { filters, page, size, sort } = req.query;
  let searchParameters = [{ createdBy }];
  if (filters && filters !== "{}") {
    filters.split(",").map((element) => {
      const queryParam = JSON.parse(element);
      const key = Object.keys(queryParam)[0];
      const value = Object.values(queryParam)[0];
      if (key === "createdBy") searchParameters.push({ [key]: value });
      else searchParameters.push({ [key]: { $regex: ".*" + value + ".*" } });
    });
  }
  const [totalTemplates, templates] = await Promise.all([
    Template.countDocuments({
      $and: searchParameters,
    }),
    Template.find({ $and: searchParameters })
      .skip((page - 1) * size)
      .limit(size)
      .sort(JSON.parse(sort)),
  ]);
  res.status(200).json({
    success: true,
    data: {
      templates,
      totalTemplates,
    },
  });
});

const getAllTemplates = asyncHandler(async (req, res, next) => {
  const { filters, page, size, sort } = req.query;
  let searchParameters = [];
  if (filters && filters !== "{}") {
    filters.split(",").map((element) => {
      const queryParam = JSON.parse(element);
      const key = Object.keys(queryParam)[0];
      const value = Object.values(queryParam)[0];
      if (key === "createdBy") searchParameters.push({ [key]: value });
      else searchParameters.push({ [key]: { $regex: ".*" + value + ".*" } });
    });
  }
  const [totalTemplates, templates] = await Promise.all([
    Template.countDocuments({
      $and: searchParameters,
    }),
    Template.find({ $and: searchParameters })
      .skip((page - 1) * size)
      .limit(size)
      .populate({ path: "createdBy", select: ["name", "_id"] })
      .sort(JSON.parse(sort)),
  ]);
  res.status(200).json({
    success: true,
    data: {
      templates,
      totalTemplates,
    },
  });
});

const getTemplateById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const template = await Template.findOne({ _id: id });
  if (!template) return next(new ErrorResponse("Template Not Found", 404));
  if (template.createdBy.toString() !== req.userId)
    return next(new ErrorResponse("Permission Denied", 403));
  res.status(201).json({
    success: true,
    data: { template },
  });
});

const updateTemplateById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const template = await Template.findOne({ _id: id });
  if (!template) return next(new ErrorResponse("Template Not Found", 404));
  if (template.createdBy.toString() !== req.userId)
    return next(new ErrorResponse("Permission Denied", 403));
  await Template.findByIdAndUpdate(id, req.body, {
    new: true, // Return the modified record instead of the original
  });
  res.status(201).json({
    success: true,
    data: { message: "Template Updated Successfully" },
  });
});

const deleteTemplate = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const template = await Template.findOne({ _id: id });
  if (!template) return next(new ErrorResponse("Template Not Found", 404));
  if (template.createdBy.toString() !== req.userId)
    return next(new ErrorResponse("Permission Denied", 403));
  await Template.deleteOne({ _id: id });
  res.status(201).json({
    success: true,
    data: { message: "Template Deleted Successfully" },
  });
});

module.exports = {
  saveTemplate,
  getTemplates,
  deleteTemplate,
  getTemplateById,
  updateTemplateById,
  getAllTemplates,
};
