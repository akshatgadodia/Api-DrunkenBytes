const mongoose = require("mongoose");
const timestamp = require('mongoose-timestamp');

const { Schema } = mongoose;

const articleSchema = new Schema({
  title: {
    type: String,
    required: [true, "Article Name is required"]
  },
  url: {
    type: String,
    unique: true,
    required: [true, "Article url is required"],
    index: true,
  },
  image: {
    type: String,
    required: [true, "Article image is required"]
  },
  description:{
    type: String,
    required: [true, "Article description is required"]
  },
  content: Object,
});

articleSchema.plugin(timestamp);

module.exports = new mongoose.model("article", articleSchema);
