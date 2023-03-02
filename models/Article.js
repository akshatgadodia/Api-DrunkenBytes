const mongoose = require("mongoose");

const { Schema } = mongoose;

const articleSchema = new Schema({
  title: {
    type: String,
    required: [true, "Article Name is required"]
  },
  url: {
    type: String,
    unique: true,
    required: [true, "Article url is required"]
  },
  image: {
    type: String,
    required: [true, "Article image is required"]
  },
  content: Object,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  dateUpdated: {
    type: Date,
    default: Date.now,
  }
});

module.exports = new mongoose.model("article", articleSchema);
