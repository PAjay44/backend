const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const express = require("express");
const userRouter = express.Router();

const USER_SAFE_DATA = ["firstName", "lastName", "age", "gender", "photoUrl","about"];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName","about","photoUrl"]);

    if (!connectionRequest) {
      res.status(404).json({ message: "connectionRequest not found" });
    }

    res.json({ message: "Data fetched successfully", data: connectionRequest });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggInUser._id, status: "accepted" },
        { toUserId: loggInUser._id, status: "accepted" },
        // loggInUser is weather fromUserId or toUserId and status accepeted return the document
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    // res.json({ connectionRequest });

    const data = connectionRequest.map((row) => {
      // we need only our connections ,filter them
      if (row.fromUserId._id.toString() === loggInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  limit = limit > 50 ? 50 : limit;

  const skip = (page - 1) * limit;
  try {
    const loggInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggInUser._id }, { toUserId: loggInUser._id }],
    }).select("fromUserId toUserId");

    const hiddeConnections = new Set();

    connectionRequest.forEach((req) => {
      //filter the same usersId using set
      hiddeConnections.add(req.fromUserId.toString()); // check only fromUserId value
      hiddeConnections.add(req.toUserId.toString()); // check only toUserId value
    });

    const data = await User.find({
      $and: [
        { _id: { $nin: [...hiddeConnections] } },
        { _id: { $ne: loggInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip) // skip(0)
      .limit(limit);

    res.send( data );
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = userRouter;
