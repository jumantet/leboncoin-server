const express = require("express");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const User = require("../models/user");

const router = express.Router();

//CREATE USER
router.post("/user/sign_up", async (req, res) => {
  try {
    const token = uid2(16);
    const salt = uid2(16);
    const password = req.body.password;
    const hash = SHA256(password + salt).toString(encBase64);

    const user = await User.findOne({ "account.email": req.body.email });

    if (user) {
      return res
        .status(400)
        .json({ message: "This mail has already been used" });
    }

    const newUser = new User({
      account: {
        email: req.body.email,
        username: req.body.username
      },
      salt: salt,
      password: hash,
      token: token,
      created: new Date()
    });

    await newUser.save();
    return res.json({
      _id: newUser._id,
      token: newUser.token,
      account: newUser.account
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

//READ USER (LOGIN)

router.post("/user/log_in", async (req, res) => {
  try {
    const user = await User.findOne({ "account.email": req.body.email });
    const password = req.body.password;
    if (SHA256(password + user.salt).toString(encBase64) === user.password) {
      return res.json(user);
    } else {
      return res.status(400).json({ error: "La connexion a échoué" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
module.exports = router;
