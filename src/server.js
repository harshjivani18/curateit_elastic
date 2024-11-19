// local environment variable
require("dotenv").config();

// Express app and port setup
const express     = require("express");
const bodyParser  = require("body-parser");
const cors        = require("cors");

// Creating App
const app         = express();

// Requesting for database access

// Setting up json response and added urlencoded
app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: "170mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "170mb" }));

// cron job
require("./cronjob/index");

// routes
require("./routes/index")(app);

// Setting up inital routes
app.get("/", (req, res) => {
  return res.status(200).send("<h4>Welcome to Curateit Logging System</h4>");
});

// Exporting app
module.exports = app;