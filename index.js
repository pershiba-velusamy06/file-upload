const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const {routes} = require("./src/routes.js");

const MONGODB_URI = process.env.MONGODB_URI;
const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

 app.use("/", routes);
// app.use("/", userRoutes.routes);

const port = process.env.PORT || 8000; // Use environment variable or default to 80

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("App is listening on url http://localhost:" + port);
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });
