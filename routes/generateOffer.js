const express = require("express");
const Offer = require("../models/offer");
const uploadPictures = require("../middlewares/uploadPictures");
const faker = require("faker/locale/fr");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();

//CREATE OFFER

router.post("/offer/generate", isAuthenticated, async (req, res) => {
  console.log("hello");
  try {
    for (let i = 0; i < 500; i++) {
      const newOffer = new Offer({
        title: faker.commerce.productName,
        description: faker.commerce.productAdjective,
        price: faker.commerce.price,
        pictures: [faker.image.image, faker.image.image],
        creator: req.user
      });
      const offer = Offer.findOne({ title: newOffer.title });
      if (!offer) {
        await newOffer.save();
        res.json({
          newOffer
        });
        i++;
      } else {
        i++;
      }
    }
    return res.json({ message: "offers has been published" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
