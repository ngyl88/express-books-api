const mongoose = require('mongoose');

const crypto = require("crypto");
const uniqueValidator = require("mongoose-unique-validator");

// CREATE SCHEMA
const schema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'cannot be blank'],
        match: [/^[a-zA-Z0-9]+$/, "is invalid"]
    },
    hash: String,
    salt: String
  },
  { timestamps: true }
);

schema.plugin(uniqueValidator, { message: "should be unique" });

// use ES5 function to prevent `this` from becoming undefined
schema.methods.setPassword = function(password) {
  this.salt = generateSalt();
  this.hash = hashPassword(password, this.salt);
};

// use ES5 function to prevent `this` from becoming undefined
schema.methods.isValidPassword = function(password) {
  return this.hash === hashPassword(password, this.salt);
};

const generateSalt = () => {
  return crypto.randomBytes(16).toString("hex");
};

const hashPassword = (password, salt) => {
  return crypto
    .pbkdf2Sync(password, salt, 10000, 512, "sha512")
    .toString("hex");
};

// CREATE MODEL FROM SCHEMA
// EXPORT MODEL
module.exports = mongoose.model('User', schema);
