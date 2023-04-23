const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

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

// pre-save hook to hash the password before saving to the database
supportUserSchema.pre('save', async function (next) {
  const supportUser = this;
  if (!supportUser.isModified('password')) return next();
  try {
    const hash = await bcrypt.hash(supportUser.password, 10);
    supportUser.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = new mongoose.model("supportUser", supportUserSchema);
