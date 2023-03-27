const mongoose = require("mongoose");

const { Schema } = mongoose;

const nftTransactionSchema = new Schema({
  txId: {
    type: String,
    unique: true,
    required: [true, "Transaction ID is required"]
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "user" },
  receiverName: String,
  receiverEmail: String,
  receiverWalletAddress: String,
  nftType: String,
  nftName: String,
  useCustomImage: {type: Boolean, default: false},
  isTransferable: {type: Boolean, default: true},
  isBurnable: {type: Boolean, default: false},
  burnAfter: Date,
  traits: [{key: String, value: String}],
  tokenId: Number,
  status: String,
  dateCreated: Date,
  value: Number,
  commissionCharged: { type: Number },

});

module.exports = new mongoose.model("nft-transaction", nftTransactionSchema);
