const mongoose = require("mongoose");

const { Schema } = mongoose;

const issueSchema = new Schema({
  issueFor: { type: Schema.Types.ObjectId, ref: "user" },
  tokenId: {
    type: Number,
    required: [true, "Token ID is required"]
  },
  txId: {
    type: String,
    required: [true, "Transaction Hash ID is required"]
  },
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  email: {
    type: String,
    required: [true, "Email is required"]
  },
  subject: {
    type: String,
    required: [true, "Subject is required"]
  },
  message: {
    type: String,
    required: [true, "Message is required"]
  },
  date: {
    type: Date,
    required: [true, "Date is required"]
  },
  isSolved: {
    type: Boolean,
    default: false
  },
});

module.exports = new mongoose.model("issue", issueSchema);
