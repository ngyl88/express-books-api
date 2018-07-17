const { PassportAuthenticationError } = require('../config/errors');

const mongoose = require("mongoose");
const { ValidationError } = mongoose.Error;

handler401 = (err, req, res, next) => {
  if (err.name === PassportAuthenticationError) {
    if (err.message === "TokenExpiredError") {
      res.status(401).json({
        message: "Token expired. Please sign in again"
      });
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    next();
  }
};

handler400 = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    console.log(err);
    res.status(400).json(err.message);
  } else {
    next(err);
  }
};

handler500 = (err, req, res, next) => {
  console.log(err);
  res.status(500).json("Oops! Please try again later.");
};

module.exports = {
  handler400,
  handler401,
  handler500
};
