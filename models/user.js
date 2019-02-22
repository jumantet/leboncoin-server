const mongoose = require("mongoose");

const User = mongoose.model("User", {
  account: {
    email: String,
    username: String
  },
  password: String,
  token: String,
  salt: String,
  created: Date
});

module.exports = User;
