const express = require("express");

const jwt = require("jsonwebtoken");
const { jwtOptions } = require("../config/passport");

const router = express.Router();
router.use(express.json());

const User = require("../models/user");

/* GET home page. */
router.get("/", (req, res, next) => {
  res.json({ message: "hello express-blog-api" });
});

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  const user = new User({ username });
  // Todo: validate password is not empty string
  user.setPassword(password);
  try {
    await user.save();
    res.json({ user });
  } catch (err) {
    next(err);
  }
  // res.json({ message: "Sign up service is not ready" });
});

router.post("/signin", async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username });
  if (!user) {
    res.status(401).json({ message: "no such user found" });
    return;
  }

  if (user.isValidPassword(password)) {
    const userId = { id: user.id };
    // synchronous call
    const token = jwt.sign(userId, jwtOptions.secretOrKey, {
      expiresIn: "1m"
    });
    res.json({ message: "signin ok", token: token });
  } else {
    res.status(401).json({ message: "passwords did not match" });
  }
});

module.exports = router;
