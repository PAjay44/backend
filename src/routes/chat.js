const { userAuth } = require("../middlewares/auth");
const express = require("express");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const onlineUsers = require("../utils/onlineUsers");
const chatRouter = express.Router();

chatRouter.get("/chat/:targetId", userAuth, async (req, res) => {
  const { targetId } = req.params;
  const user = req.user;
  const userId = user._id;

  // cannot send msg who are not in my connections

  const connection = await ConnectionRequest.findOne({
    $or: [
      { fromUserId: userId, toUserId: targetId, status: "accepted" },
      { fromUserId: targetId, toUserId: userId, status: "accepted" },
    ],
  });

  let chat = await Chat.findOne({
    participants: { $all: [userId, targetId] },
  }).populate({ path: "messages.senderId", select: "firstName" });
  // find the chat between these participants

  if (!chat) {
    chat = await new Chat({ participants: [userId, targetId], messages: [] });
    await chat.save();
  }

  res.json(chat);
});

chatRouter.get("/status/:targetId", userAuth, async (req, res) => {
  const { targetId } = req.params;
  const user = await User.findById(targetId).select("lastSeen");
  const online = onlineUsers.has(targetId);

  res.json({
    online,
    lastSeen: user?.lastSeen,
  });
});

module.exports = chatRouter;
