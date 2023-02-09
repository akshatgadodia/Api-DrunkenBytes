const mongoose = require("mongoose");

const { Schema } = mongoose;

const messageSchema = new Schema({
  messageBy: { type: Schema.Types.ObjectId, ref: "user" },
  subject: {
    type: String,
    required: [true, "Subject is required"]
  },
  type: {
    type: String,
    required: [true, "Type is required"]
  },
  message: {
    type: String,
    required: [true, "Message is required"]
  },
  date: {
    type: Date,
    required: [true, "Message is required"]
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

module.exports = new mongoose.model("message", messageSchema);
