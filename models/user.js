const mongoose = require("mongoose");

const User = mongoose.model("User", {
  account: {
    email: String,
    username: { type: String, unique: true, required: true }
  },
  password: String,
  token: String,
  salt: String,
  created: Date
});

module.exports = User;
