const mongoose = require("mongoose");

const { Schema } = mongoose;

const tokenIdSchema = new Schema({
    value: { 
        type: Number, 
        default: 0 
    }
});

module.exports = new mongoose.model("tokenId", tokenIdSchema);
