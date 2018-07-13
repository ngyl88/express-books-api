require("dotenv").config();
const mongoose = require("mongoose");

const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");

const index = require("./routes/index");
const books = require("./routes/books");
const authors = require("./routes/authors");
const users = require("./routes/users");

// DATABASE
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on("error", error =>
  console.error("An error occured in DB connection!", error)
);

// APP
const app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", index);

app.get("/secret", (req, res, next) => {
  res.json('You see the secret');
});

books(app);
authors(app);
users(app);

module.exports = app;
