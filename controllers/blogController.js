const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const Blog = require("../models/Blog");

const saveBlog = asyncHandler(async (req, res, next) => {
    req.body.content=JSON.parse(req.body.content)
  await new Blog(req.body).save();
  res.status(200).json({
    success: true,
    data: {
      message: "blog Successfully Created"
    }
  });
});

const getBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await Blog.find()
  res.status(200).json({
    success: true,
    data: {
      messages: blogs
    }
  });
});

const getBlogsByUrl = asyncHandler(async (req, res, next) => {
  const blogs = await Blog.find({ url: req.body.url });
  res.status(201).json({
    success: true,
    data: {
      message: blogs
    }
  });
});

const updateBlog = asyncHandler(async (req, res, next) => {
    req.body.dateUpdated= new Date()
    const blog = await Blog.updateOne({ url: req.body.url },{$set:req.body},{new:true});
    console.log(blog);
    res.status(201).json({
      success: true,
      data: {
        message: blog
      }
    });
  });

module.exports = { saveBlog, getBlogs, getBlogsByUrl,updateBlog};
