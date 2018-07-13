const express = require("express");
const router = express.Router();

// MODEL
const User = require("../models/user");

router.get("/", async (req, res, next) => {
  const users = await User.find();
  res.json({
    message: "List of users retrieved successfully",
    users
  });
});

module.exports = app => {
  app.use("/users", router);
};
