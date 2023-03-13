const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const Product = require("../models/Product");

const saveProduct = asyncHandler(async (req, res, next) => {
  await new Product(req.body).save();
  res.status(200).json({
    success: true,
    data: {
      message: "Product Successfully Created"
    }
  });
});

const getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({createdBy: req.userId})
  res.status(200).json({
    success: true,
    data: {
      articles: products
    }
  });
});



module.exports = { saveProduct, getProducts };