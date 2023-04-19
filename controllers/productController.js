const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const Product = require("../models/Product");

const saveProduct = asyncHandler(async (req, res, next) => {
  await new Product({
    createdBy: req.userId,
    traits: req.body.traits,
    nftType: req.body.nftType,
    name: req.body.name
  }).save();
  res.status(200).json({
    success: true,
    data: {
      message: "Product Successfully Created"
    }
  });
});

const getTemplates = asyncHandler(async (req, res, next) => {
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
    createdBy: createdBy
  });
  const templates = await Product.find({ $and: searchParameters })
    .skip((page - 1) * size)
    .limit(size);
  const totalTemplates = await Product.countDocuments({
    $and: searchParameters
  });
  res.status(200).json({
    success: true,
    data: {
      templates,
      totalTemplates
    }
  });
});

const getAllTemplates = asyncHandler(async (req, res, next) => {
  const createdBy = req.userId;
  const templates = await Product.find({ createdBy: createdBy});
  res.status(200).json({
    success: true,
    data: {
      templates
    }
  });
});

const getTemplateById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const template = await Product.findOne({_id: id})
  if(!template) return next(new ErrorResponse("Template Not Found", 404));
  if(template.createdBy.toString() !== req.userId) return next(new ErrorResponse("Permission Denied", 403));
  res.status(201).json({
    success: true,
    data: {template}
  });
});

const updateTemplateById = asyncHandler(async (req, res, next) => {
  const id = req.params.id
  const template = await Product.findOne({_id: id})
  if(!template) return next(new ErrorResponse("Template Not Found", 404));
  if(template.createdBy.toString() !== req.userId) return next(new ErrorResponse("Permission Denied", 403));
  await Product.findByIdAndUpdate(id, req.body, {
    new: true, // Return the modified record instead of the original
  });
  res.status(201).json({
    success: true,
    data: {message : "Template Updated Successfully"}
  });
});

const deleteTemplate = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const template = await Product.findOne({_id: id})
  if(!template) return next(new ErrorResponse("Template Not Found", 404));
  if(template.createdBy.toString() !== req.userId) return next(new ErrorResponse("Permission Denied", 403));
  await Product.deleteOne({_id: id});
  res.status(201).json({
    success: true,
    data: {message : "Template Deleted Successfully"}
  });
});

module.exports = { saveProduct, getTemplates, deleteTemplate, getTemplateById, updateTemplateById, getAllTemplates };
