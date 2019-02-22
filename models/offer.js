const mongoose = require("mongoose");

const Offer = mongoose.model("Offer", {
  title: { type: String, minlength: 1, maxlength: 50, required: true },
  description: { type: String, maxlength: 500 },
  price: { type: Number, min: 0, maxlength: 100000 },
  pictures: Array,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  created: Date
});

module.exports = Offer;
