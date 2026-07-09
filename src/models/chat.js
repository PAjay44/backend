const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // defining a message
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true },
  },
  { timestamps: true },
);

const chatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  // A chat is nothing but, participants in that particular chat ,and type of user an objectId
  messages: [messageSchema],
});

const Chat = new mongoose.model("Chat", chatSchema);
module.exports = { Chat };


