const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user?._id;
      const toUserId = req.params?.toUserId;
      const status = req.params?.status;

      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type " + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "User not found!! " });
      }

      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnection) {
        return res.status(400).json({ message: "Connection already exists." });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message:
          req.user.fname +
          " send a " +
          status +
          " connection to " +
          toUser.fname,
        data: data,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      // Validate the status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Connection status is invalid.");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        fromUserId: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(400).send("No connection found");
      }

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR!! : " + err);
    }
  }
);

module.exports = requestRouter;
