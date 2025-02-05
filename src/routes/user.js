const express = require("express");
const { userAuth } = require("../models/middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const SAFE_USER_DATA = "fname lname  age gender about skills photoUrl";

userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionReceived = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", SAFE_USER_DATA);

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

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
        },
        {
          toUserId: loggedInUser._id,
        },
      ],
    }).select("fromUserId toUserId");
    const hideUserFromFeed = new Set();

    hideUserFromFeed.add(loggedInUser._id.toString());

    connectionRequest.forEach((conn) => {
      hideUserFromFeed.add(conn.fromUserId.toString());
      hideUserFromFeed.add(conn.toUserId.toString());
    });

    const feedUsers = await User.find({
      _id: { $nin: Array.from(hideUserFromFeed) },
    })
      .select(SAFE_USER_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ message: "Feed is ready ", data : feedUsers });
  } catch (err) {
    res.status(400).send({ message: "ERROR : " + err });
  }
});

module.exports = userRouter;
