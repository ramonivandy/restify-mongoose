const errors = require("restify-errors");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const auth = require("../routes/auth");
const jwt = require("jsonwebtoken");
const config = require("../config");

User.createMapping((err, mapping) => {
  if (err) {
    console.log("error creating mapping");
    console.log(err);
  } else {
    console.log("mapping created");
    console.log(mapping);
  }
});

var stream = User.synchronize();
var count = 0;

stream.on("data", () => {
  count++;
});

stream.on("close", () => {
  console.log("Indexed " + count + " Documents");
});

stream.on("error", err => {
  console.log(err);
});

module.exports = server => {
  // Register User
  server.post("/api/register", (req, res, next) => {
    const { email, password } = req.body;

    const user = new User({
      email,
      password
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        // hash password
        user.password = hash;
        // Save User
        try {
          const newUser = await user.save();
          res.send(201);
          next();
        } catch (err) {
          return next(new errors.InternalError(err.message));
        }
      });
    });
  });

  // Auth User
  server.post("/auth", async (req, res, next) => {
    const { email, password } = req.body;
    try {
      // auth user
      const user = await auth.authenticate(email, password);
      //create token
      const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
        expiresIn: "15m"
      });
      const { iat, exp } = jwt.decode(token);
      // send response with token
      res.send({ iat, exp, token });
      next();
    } catch (err) {
      //user unauth
      return next(new errors.NotAuthorizedError(err));
    }
  });
};
