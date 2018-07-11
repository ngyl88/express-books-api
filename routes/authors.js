const express = require("express");
const router = express.Router();

// MODEL
const Author = require("../models/author");
const Book = require("../models/book");

/* GET author */
router.get("/", async (req, res, next) => {
  const authors = await Author.find();
  res.json({
    message: "List of authors retrieved successfully",
    authors: authors
  });
});
router.get("/:id", async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);
    if(author) {
      const books = await Book.find({ author: req.params.id });
      res.json({
        ...author.toJSON(),
        books
      });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});

/* POST author */
router.post("/", async (req, res, next) => {
  try {
    const newAuthor = new Author({
      name: req.body.name,
      age: req.body.age
    });

    const result = await newAuthor.save();
    res.status(201).json({
      message: `created new author successfully with id ${result._id}`
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
});

/* PUT author */
router.put("/:id", async (req, res, next) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    updatedAuthor === null
      ? next()
      : res.json({
          message: `updated author with id ${req.params.id}`
        });
  } catch (error) {
    console.error("Error in put author!", error);
    res.status(400).json({
      message: "Bad request!"
    });
  }
});

router.use((req, res) => {
  res.status(404).json({ message: `Not Found!` });
});

module.exports = router;
