const mongoose = require("mongoose");

// CREATE SCHEMA
const schema = mongoose.Schema({
  name: String,
  age: Number
});

// CREATE MODEL FROM SCHEMA
// EXPORT MODEL
module.exports = mongoose.model('Author', schema);
