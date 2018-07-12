const { ValidationError } = require('mongoose').Error;

const express = require("express");
const router = express.Router();
// For POST request
router.use(express.json());

// MODEL
const Book = require("../models/book");

/* GET books listing. */
router.get("/", async (req, res, next) => {
  const books = await Book.find().populate("author");
  res.json(books);
});

router.get("/:id", async (req, res, next) => {
  const book = await Book.findById(req.params.id).populate("author");
  book === null ? next() : res.json(book);
});

/* POST book */
router.post("/", async (req, res, next) => {
  try {
    const newBook = new Book({
      title: req.body.title,
      author: req.body.authorId
    });

    const result = await newBook.save();
    res
      .status(201)
      .json({ message: `created new book successfully with id ${result._id}` });
  } catch (error) {
    if(error instanceof ValidationError) {
      res.status(400).json(error.message);
    } else {
      console.error("Error in post book!", error);
      next(error);
    }
  }
});

/* PUT book */
router.put("/:id", async (req, res, next) => {
  const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body);
  updatedBook === null
    ? next()
    : res.json({ message: `updated book with id ${req.params.id}` });
});

/* DELETE book */
router.delete("/:id", async (req, res, next) => {
  const bookToDelete = await Book.findByIdAndDelete(req.params.id);
  bookToDelete === null
    ? next()
    : res.json({ message: `delete book with id ${req.params.id}` });
});

router.use((req, res) => {
  // console.log('In 404 handler:', req.params, req.path);
  res.status(404).json({ message: `Book with id ${req.path} Not Found!` });
});

module.exports = app => {
  app.use("/books", router);
};
