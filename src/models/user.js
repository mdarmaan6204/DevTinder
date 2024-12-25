const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
  },
  gender: {
    type: String,
  },
  password: {
    type: String,
  },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
