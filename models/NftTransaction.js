const mongoose = require("mongoose");

const { Schema } = mongoose;

const nftTransactionSchema = new Schema({
  txId: {
    type: String,
    unique: true,
    required: [true, "Transaction ID is required"]
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "user" },
  buyerName: String,
  buyerEmail: String,
  brandName: String,
  productName: String,
  productId: String,
  tokenId: Number,
  warrantyExpireDate: Date,
  status: String,
  buyerMetamaskAddress: String,
  dateCreated: Date,
  value: Number,
  methodType: Number
});

module.exports = new mongoose.model("nft-transaction", nftTransactionSchema);