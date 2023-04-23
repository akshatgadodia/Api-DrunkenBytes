const mongoose = require("mongoose");

const { Schema } = mongoose;

const apiKeySchema = new Schema({
  createdBy: { type: Schema.Types.ObjectId, ref: "user" },
  name: {
    type: String,
    required: [true, "API Name is required"],
    trim: true,
  },
  apiKey: {
    type: String,
    unique: true,
    required: [true, "API KEY is required"],
    trim: true,
  },
});

module.exports = new mongoose.model("api-key", apiKeySchema);
