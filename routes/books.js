const express = require("express");
const router = express.Router();

// MODEL
const Book = require("../models/book");

/* GET books listing. */
router.get("/", async (req, res, next) => {
  const books = await Book.find();
  res.json(books);
});

router.get("/:id", async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  book === null ? next() : res.json(book);
});

router.post("/", async (req, res, next) => {
  const newBook = new Book({
    title: req.body.title,
    author: req.body.author
  });

  const result = await newBook.save();

  res
    .status(201)
    .json({ message: `created new book successfully with id ${result._id}` });
});

router.put("/:id", async (req, res, next) => {
  const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body);
  updatedBook === null
    ? next()
    : res.json({ message: `updated book with id ${req.params.id}` });
});

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

module.exports = router;
