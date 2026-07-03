const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:id", userAuth, async (req, res) => {
  const status = req.params.status;
  const toUserId = req.params.id;
  const fromUserId = req.user._id;

  try {
    // handling corner cases
    const allowedStatus = ["interested", "ignored"];
    if (!allowedStatus.includes(status)) {
      return res
        .status(404)
        .json({ message: "Invalid status type :" + status });
    }

    // check toUser present in DB
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).send("user not found");
    }

    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    // check wheather from,touser document or fromUser as toUser, toUser as fromUser document if exist

    if (existingConnectionRequest) {
      return res
        .status(404)
        .send({ message: "ConnectionRequest already exist" });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();
    res.json({ message: "connectionRequest sent successfully", data });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      const loggInUser = req.user;

      if (!allowedStatus.includes(status)) {
        res.status(404).json({ message: "status not allowed" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggInUser._id,
        status: "interested",
      });
      // check status should be interested,toUserId should be loggerInUser, requestId all these should be in ConnectionRequest table data.

      if (!connectionRequest) {
        res.status(404).json({ message: "connectionRequest not found" });
      }

      connectionRequest.status = status;
      // if everything is there, change the status to accepted

      const data = await connectionRequest.save();

      res.json({ message: "ConnectionRequest " + status, data });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  },
);

module.exports = requestRouter;
