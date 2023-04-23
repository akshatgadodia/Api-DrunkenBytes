const mongoose = require("mongoose");
const timestamp = require('mongoose-timestamp');

const { Schema } = mongoose;

const blogSchema = new Schema({
  title: {
    type: String,
    required: [true, "Blog Name is required"]
  },
  url: {
    type: String,
    unique:true,
    required: [true, "Blog url is required"],
    index: true,
  },
  image: {
    type: String,
    required: [true, "Blog image is required"]
  },
  content: Object,
});

blogSchema.plugin(timestamp);

module.exports = new mongoose.model("blog", blogSchema);
