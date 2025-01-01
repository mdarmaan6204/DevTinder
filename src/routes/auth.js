const express = require("express");
const { signUpValidation } = require("../utils/validations");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // Validate the data
    signUpValidation(req);
    const { fname, lname, email, password } = req.body;

    // Encypt the data
    const hashPassword = await bcrypt.hash(password, 10);

    const userObj = new User({
      fname,
      lname,
      email,
      password: hashPassword,
    });

    // Saving the user object to the database
    await userObj.save();
    res.send("User added Successfully");
  } catch (err) {
    res.send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Enter valid email and password");
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("User not found");
    }
    const isValidPassword = await user.validatePassword(password);

    if (!isValidPassword) {
      throw new Error("Invalid password");
    } else {
      // Generating a JWT token
      const token = await user.getJWT();
      // Adding the token to the cookie
      res.cookie("token", token, { expires: new Date(Date.now() + 900000) });

      res.send("User logged in successfully");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = authRouter;
