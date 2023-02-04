const mongoose = require("mongoose");

const { Schema } = mongoose;

const transactionSchema = new Schema({
      txId: {
        type: String,
        unique: true,
        required: [true, "Transaction ID is required"]
      },
      createdBy: mongoose.ObjectId,
      buyerName: String,
      buyerEmail: String,
      brandName: String,
      productName: String,
      productId: String,
      tokenId: Number,
      warrantyExpireDate: String,
      status: String,
      buyerMetamaskAddress: String,
      dateCreated: Date,
      value: Number,
      methodType: Number
});

module.exports = new mongoose.model("transaction", transactionSchema);
