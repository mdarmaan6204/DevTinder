const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    lname: {
      type: String,
    },
    age: {
      type: Number,
      min: 18,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    password: {
      type: String,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong Password");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://www.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_134151661.htm",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error(" Invalid Photo URL");
        }
      },
    },
    skills: {
      type: [String],
    },
    about: {
      type: String,
      default: "Hey there I am using this app",
    },
  },
  { timestamps: true }
);
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "dev@tinder123", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (inputPassword) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(inputPassword, passwordHash);
  return isPasswordValid;
};
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
