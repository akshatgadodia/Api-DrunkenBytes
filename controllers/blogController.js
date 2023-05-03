const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const Blog = require("../models/Blog");

const saveBlog = asyncHandler(async (req, res, next) => {
  req.body.content = JSON.parse(req.body.content);
  await new Blog(req.body).save();
  res.status(200).json({
    success: true,
    data: { message: "Blog Successfully Created" },
  });
});

const getBlogs = asyncHandler(async (req, res, next) => {
  const { page, size } = req.query;
  const [blogs, totalBlogs] = await Promise.all([
    Blog.find({}).select({content: 0})
      .skip((page - 1) * size)
      .limit(size)
      .sort({ createdAt: -1 }),
    Blog.countDocuments({})
  ]);
  res.status(200).json({
    success: true,
    data: { blogs,totalBlogs },
  });
  
});

const getBlogsByUrl = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findOne({ url: req.query.url });
  res.status(201).json({
    success: true,
    data: { blog },
  });
});

const updateBlog = asyncHandler(async (req, res, next) => {
  await Blog.updateOne(
    { url: req.body.url },
    { $set: req.body },
    { new: true }
  );
  res.status(201).json({
    success: true,
    data: { message: "Blog Updated Successfully" },
  });
});

module.exports = { saveBlog, getBlogs, getBlogsByUrl, updateBlog };
