// const User = require("../models/user");
const express = require("express");
const Offer = require("../models/offer");
const uploadPictures = require("../middlewares/uploadPictures");
const isAuthenticated = require("../middlewares/isAuthenticated");
var ObjectId = require("mongoose").Types.ObjectId;

const router = express.Router();

//CREATE OFFER

router.post(
  "/offer/publish",
  isAuthenticated,
  uploadPictures,
  async (req, res) => {
    try {
      const newOffer = new Offer({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        pictures: req.pictures,
        creator: req.user
      });
      await newOffer.save();
      res.json({
        newOffer
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
);

//READ

router.get("/offer/with-count", async (req, res) => {
  try {
    let filters = {};

    if (req.query.title) {
      filters.title = {
        $regex: req.query.title,
        $options: "i"
      };
    }

    if (
      (req.query.priceMax !== undefined && req.query.priceMax !== "") ||
      (req.query.priceMin !== undefined && req.query.priceMin !== "")
    ) {
      filters.price = {};
      if (req.query.priceMin) {
        filters.price["$gte"] = req.query.priceMin;
      }

      if (req.query.priceMax) {
        filters.price["$lte"] = req.query.priceMax;
      }
    }

    const filtered = Offer.find(filters);

    if (req.query.skip !== undefined && req.query.limit !== undefined) {
      filtered.skip(parseInt(req.query.skip)).limit(parseInt(req.query.limit));
    }

    if (req.query.sort) {
      if (req.query.sort === "price-desc") {
        filtered.sort({ price: -1 });
      } else if (req.query.sort === "price-asc") {
        filtered.sort({ price: 1 });
      } else if (req.query.sort === "date-desc") {
        filtered.sort({ created: -1 });
      } else if (req.query.sort === "date-asc") {
        filtered.sort({ created: 1 });
      }
    }
    const offers = await filtered;
    return res.json(offers);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/offer/:id", async (req, res) => {
  try {
    const offer = await Offer.findOne({
      _id: ObjectId(req.params.id)
    }).populate("creator");

    if (offer) {
      return res.json(offer);
    } else {
      return res.status(400).json({ message: "Cette offre n'existe pas" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
module.exports = router;
