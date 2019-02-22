require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

var helmet = require("helmet");
app.use(helmet());

mongoose.connect("mongodb://localhost:27017/leboncoin-server", {
  useNewUrlParser: true
});

//Import Models
require("./models/offer");
require("./models/user");

//Import Routes
const userRoutes = require("./routes/user");
const offerRoutes = require("./routes/offer");
app.use(userRoutes);
app.use(offerRoutes);

app.listen(process.env.PORT || 3000, () => console.log("Server has started"));
