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
    const toUser = await User.findById(toUserId)
    if(!toUser){
        return res.status(404).send('user not found')
    }
    
    const existingConnectionRequest = await User.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    // check wheather from,touser document or fromUser as toUser, toUser as fromUser document if exist

    if (existingConnectionRequest) {
      return res.status(404).send({message:"ConnectionRequest already exist"});
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    await connectionRequest.save();
    res.send("connectionRequest sent successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = requestRouter;
