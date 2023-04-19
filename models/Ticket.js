const mongoose = require("mongoose");

const { Schema } = mongoose;

const ticketSchema = new Schema({
  createdBy: { type: Schema.Types.ObjectId, ref: "user" },
  subject: {
    type: String,
    required: [true, "Subject is required"]
  },
  type: {
    type: String,
    required: [true, "Type is required"]
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
  },
  isSolved: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default : "Response Pending by Support"
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  conversation: [
    {
      sentBy:{
        type: String
      },
      sender: {
        type: Schema.Types.ObjectId,
        refPath: 'conversation.sentBy'
      },
      message: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ]
});

module.exports = new mongoose.model("ticket", ticketSchema);
