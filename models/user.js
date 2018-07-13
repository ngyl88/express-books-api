const mongoose = require('mongoose');

// CREATE SCHEMA
const schema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// CREATE MODEL FROM SCHEMA
// EXPORT MODEL
module.exports = mongoose.model('User', schema);
