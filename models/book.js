const mongoose = require('mongoose');
const Author = require('./author');

// CREATE SCHEMA
const schema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        validate: {
            validator: function(authorId) {
                console.log(`${authorId} is ${Author.findById(authorId)}`);
                return Author.findById(authorId)
            }, 
            message: '{VALUE} is not a valid authorId' 
        }
    },
});

// CREATE MODEL FROM SCHEMA
// const Book = mongoose.model('Book', schema);

// EXPORT MODEL
// module.exports = Book;
module.exports = mongoose.model('Book', schema);