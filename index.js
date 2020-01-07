const restify = require("restify"),
  mongoose = require("mongoose"),
  config = require("./config"),
  rjwt = require("restify-jwt-community");

const server = restify.createServer();

/**
 * Middleware
 */
server.use(restify.plugins.bodyParser());

/**
 * Protect Routes
 */
server.use(
  rjwt({
    secret: config.JWT_SECRET
  }).unless({
    path: ["/auth"]
  })
);

server.listen(config.PORT, () => {
  mongoose.set("useFindAndModify", false);
  mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

const db = mongoose.connection;

db.on("error", err => console.log(err));

db.once("open", () => {
  require("./routes/customers")(server);
  require("./routes/users")(server);
  console.log(`Server started on port ${config.PORT}`);
});
