const mongoose = require("mongoose");

const { Schema } = mongoose;

const templateSchema = new Schema({
  createdBy: { type: Schema.Types.ObjectId, ref: "user" },
  traits: Object,
  nftType: String,
  name: { type: String, required: [true, "Template Name is required"]}

});

module.exports = new mongoose.model("template", templateSchema);
