const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const Article = require("../models/Article");

const saveArticle = asyncHandler(async (req, res, next) => {
    req.body.content=JSON.parse(req.body.content)
  await new Article(req.body).save();
  res.status(200).json({
    success: true,
    data: {
      message: "Article Successfully Created"
    }
  });
});

const getArticles = asyncHandler(async (req, res, next) => {
  const articles = await Article.find()
  res.status(200).json({
    success: true,
    data: {
      messages: articles
    }
  });
});

const getArticlesByUrl = asyncHandler(async (req, res, next) => {
  const articles = await Article.find({ url: req.body.url });
  res.status(201).json({
    success: true,
    data: {
      message: articles
    }
  });
});

const updateArticle = asyncHandler(async (req, res, next) => {
    req.body.dateUpdated= new Date()
    const article = await Article.updateOne({ url: req.body.url },{$set:req.body},{new:true});
    console.log(article);
    res.status(201).json({
      success: true,
      data: {
        message: article
      }
    });
  });

module.exports = { saveArticle, getArticles, getArticlesByUrl,updateArticle};
