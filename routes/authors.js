const express = require("express");
const router = express.Router();

// MODEL
const Author = require("../models/author");

/* GET author */
router.get("/", async (req, res, next) => {
  const authors = await Author.find();
  res.json({
    message: "List of authors retrieved successfully",
    authors: authors
  });
});

/* POST author */
router.post("/", async (req, res, next) => {
  const newAuthor = new Author({
    name: req.body.name,
    age: req.body.age
  });

  const result = await newAuthor.save();

  res
    .status(201)
    .json({ message: `created new author successfully with id ${result._id}` });
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
