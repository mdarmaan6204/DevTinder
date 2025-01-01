const express = require("express");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEdit } = require("../utils/validations");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found ");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isValidEdit = validateProfileEdit(req);

    if (!isValidEdit) {
      throw new Error("Invalid Field Edit");
    }

    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.fname} , your profile is updated Successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const newPasswordHash = await bcrypt.hash(req.body?.password, 10);
    loggedInUser.password = newPasswordHash;
    loggedInUser.save();
    res.send("Password Updated successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err);
  }
});

module.exports = profileRouter;
