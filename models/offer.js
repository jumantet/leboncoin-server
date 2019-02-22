const mongoose = require("mongoose");

const Offer = mongoose.model("Offer", {
  title: String,
  description: String,
  price: Number,
  pictures: Array,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  created: Date
});

module.exports = Offer;
