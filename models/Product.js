const mongoose = require("mongoose");

const { Schema } = mongoose;

const productsSchema = new Schema({
  createdBy: { type: Schema.Types.ObjectId, ref: "user" },
  traits: Object,
  nftType: String,
  name: { type: String, required: [true, "Product Name is required"]}

});

module.exports = new mongoose.model("product", productsSchema);
