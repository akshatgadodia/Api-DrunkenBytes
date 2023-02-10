const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  accountAddress: {
    type: String,
    unique: true,
    required: [true, "Account Address is required"]
  },
  name: { type: String, required: false },
  email: { type: String, trim: true, lowercase: true, required: false },
  walletBalance: { type: Number, default: 0.0001 },
  roles: { type: Object }
});

module.exports = new mongoose.model("user", userSchema);
