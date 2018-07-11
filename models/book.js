const mongoose = require('mongoose');

// CREATE SCHEMA
const schema = mongoose.Schema({
    title: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
});

// CREATE MODEL FROM SCHEMA
// const Book = mongoose.model('Book', schema);

// EXPORT MODEL
// module.exports = Book;
module.exports = mongoose.model('Book', schema);