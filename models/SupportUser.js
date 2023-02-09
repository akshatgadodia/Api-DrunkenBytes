const mongoose = require("mongoose");

const { Schema } = mongoose;

const supportUserSchema = new Schema({
  name: { type: String, required: [true, "Name is required"] },
  password: { type: String, required: [true, "Password is required"] },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, "Email is required"]
  },
  roles: { type: Object }
});

module.exports = new mongoose.model("supportUser", supportUserSchema);
