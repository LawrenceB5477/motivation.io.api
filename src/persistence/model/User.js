const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
  _id: String,
  author: {
    type: String,
    required: true
  },
  authorSlug: {
    type: String,
    required: true,
  },
  tags: [String],
  rating: {
    type: Number,
    required: true
  }
}, { _id: false});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  quotes: [quoteSchema],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
