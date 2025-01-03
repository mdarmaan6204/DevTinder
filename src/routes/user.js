const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

const userRouter = express.Router();

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionReceived = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "fname lname  age, gender ");

    res.json({
      message: "Connection fetch Successfully!",
      data: connectionReceived,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err);
  }
});

userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const SAFE_USER_DATA = "fname lname  age gender about skills";
    const connections = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_USER_DATA)
      .populate("toUserId", SAFE_USER_DATA);

    const data = connections.map((row) => {
      if (loggedInUser._id.equals(row.fromUserId._id)) return row.toUserId;
      else return row.fromUserId;
    });

    res.json({ message: "Connection Fetch sucessfully", data });
  } catch (err) {
    res.status(400).send({ message: "ERROR : " + err });
  }
});

module.exports = userRouter;
