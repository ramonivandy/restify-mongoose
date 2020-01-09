const mongoose = require("mongoose");
const timestamp = require("mongoose-timestamp");
const mongoosastic = require("mongoosastic");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});
UserSchema.plugin(mongoosastic, {
  hosts: ["localhost:9201"]
});
UserSchema.plugin(timestamp);

const User = mongoose.model("User", UserSchema);
module.exports = User;
