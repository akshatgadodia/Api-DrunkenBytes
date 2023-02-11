const mongoose = require("mongoose");

const { Schema } = mongoose;

const walletTransactionSchema = new Schema({
  txId: {
    type: String,
    unique: true,
    required: [true, "Transaction ID is required"]
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "user" },
  status: String,
  dateCreated: Date,
  value: Number,
});

module.exports = new mongoose.model("wallet-transaction", walletTransactionSchema);
