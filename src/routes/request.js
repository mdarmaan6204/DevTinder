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

module.exports = requestRouter;
