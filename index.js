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

mongoose.connect(process.env.MONGODB_URI, {
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

app.listen(process.env.PORT, () => console.log("Server has started"));
