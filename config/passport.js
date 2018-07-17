// in config/passport.js
require('dotenv').config();
const passport = require("passport");
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const User = require("../models/user");

const jwtOptions = {
  // ignoreExpiration: true,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

const verify = async (jwt_payload, done) => {
  console.log('jwt_payload', jwt_payload);
  const user = await User.findOne({ _id: jwt_payload.id });
  if (user) {
    done(null, user);
  } else {
    done(null, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, verify);

passport.use(jwtStrategy);

// REF: https://jonathas.com/token-based-authentication-in-nodejs-with-passport-jwt-and-bcrypt/
const authenticate = (req, res, next) => passport.authenticate("jwt", { session: false },
(err, user, info) => {
  if (err) return next(err);
  if (!user) {
    if (info.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({
          message: "Token expired. Please sign in again"
        });
    } else {
      console.info(`Authentication: ${info.name}: ${info.message}`);
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
  return next();
}
)(req, res, next);

module.exports = {
  jwtOptions,
  authenticate
};