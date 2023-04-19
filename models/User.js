const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  accountAddress: {
    type: String,
    unique: true,
    required: [true, "Account Address is required"]
  },
  logo: { type: String, required: false },
  name: { type: String, required: false },
  email: { type: String, trim: true, lowercase: true, required: false },
  walletBalance: { type: Number, default: 0.0001 },
  commissionPercent: { type: Number, default: 5.00 },
  roles: { type: Object },
  verified: {type: Boolean, default: false},
  verifiedBy: { type: Schema.Types.ObjectId, ref: "supportUser" },
});

module.exports = new mongoose.model("user", userSchema);
