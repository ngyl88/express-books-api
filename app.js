const mongoose = require("mongoose");

const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");

const index = require("./routes/index");
const books = require("./routes/books");
const authors = require("./routes/authors");

// DATABASE
mongoose.connect("mongodb://localhost/jumpstart");
const db = mongoose.connection;
db.on("error", error =>
  console.error("An error occured in DB connection!", error)
);

// APP
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", index);
app.use("/books", books);
authors(app);

module.exports = app;
