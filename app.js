require("dotenv").config();
const mongoose = require("mongoose");
const { ValidationError } = mongoose.Error;

const { passport } = require("./config/passport");

const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");

const index = require("./routes/index");
const books = require("./routes/books");
const authors = require("./routes/authors");
const users = require("./routes/users");

// DATABASE
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true }
);

const db = mongoose.connection;
db.on("error", error =>
  console.error("An error occured in DB connection!", error)
);

// APP
const app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(passport.initialize());
app.use("/", index);

app.get(
  "/secret",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    console.log('Handling secret (session)', req.session);
    console.log('Handling secret (passport)', req.passport);
    console.log('Handling secret (user)', req.user);
    res.json("You see the secret");
  }
);

books(app);
authors(app);
users(app);

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(400).json(err.message);
  } else {
    next(err);
  }
});

module.exports = app;
