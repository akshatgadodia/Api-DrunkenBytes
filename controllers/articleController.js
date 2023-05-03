const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const Article = require("../models/Article");

const saveArticle = asyncHandler(async (req, res, next) => {
  req.body.content = JSON.parse(req.body.content);
  await new Article(req.body).save();
  res.status(200).json({
    success: true,
    data: { message: "Article Successfully Created" },
  });
});

const getArticles = asyncHandler(async (req, res, next) => {
  const { page, size } = req.query;
  const [articles, totalArticles] = await Promise.all([
    Article.find({}).select({content: 0})
      .skip((page - 1) * size)
      .limit(size)
      .sort({ createdAt: -1 }),
    Article.countDocuments({})
  ]);
  res.status(200).json({
    success: true,
    data: { articles,totalArticles },
  });
});

const getArticlesByUrl = asyncHandler(async (req, res, next) => {
  const article = await Article.findOne({ url: req.query.url });
  res.status(201).json({
    success: true,
    data: { article },
  });
});

const updateArticle = asyncHandler(async (req, res, next) => {
  await Article.updateOne(
    { url: req.body.url },
    { $set: req.body },
    { new: true }
  );
  res.status(201).json({
    success: true,
    data: { message: "Article Updated Successfully" },
  });
});

module.exports = { saveArticle, getArticles, getArticlesByUrl, updateArticle };
