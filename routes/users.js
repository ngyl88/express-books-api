const express = require("express");
const router = express.Router();

// MODEL
const User = require("../models/user");

router.get("/", async (req, res, next) => {
  console.log('Handling users (session)', req.session);
  console.log('Handling users (passport)', req.passport);
  console.log('Handling users (user)', req.user);
  const users = await User.find();
  res.json({
    message: "List of users retrieved successfully",
    users
  });
});

module.exports = app => {
  app.use("/users", router);
};
