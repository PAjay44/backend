const socket = require("socket.io"); // socket config
const crypto = require("crypto");
const {Chat} = require("../models/chat");
const { socketAuth } = require("../middlewares/socketAuth");

const getSecretRoomId = (userId, targetId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });
  io.use(socketAuth);
  io.on("connection", (socket) => {
    // this will accept incoming connection

    socket.on("joinChat", ({ targetId }) => {
        const userId = socket.user._id;
      // To listen for an event from the client,
      const roomId = getSecretRoomId(userId, targetId);
      socket.join(roomId);
      // we have create the roomId so two users can chat each other
      console.log("joined room: " + roomId);
    });

    socket.on("sendMessage", async ({ targetId, text }) => {
      try {
         const userId = socket.user._id;
         const firstName = socket.user.firstName;
        const roomId = getSecretRoomId(userId, targetId);
        // But hashing adds an extra layer of protection by hiding the actual user IDs.
        let chat = await Chat.findOne({ participants: { $all:[userId, targetId]} });
        // check weather the chat exist between these people or not
        // why because if chat already exist we can append.

        if (!chat) {
          chat = new Chat({
            participants: [userId, targetId],
            messages:[],
          });
        }

        chat.messages.push({ senderId: userId, text })

        await chat.save();
        io.to(roomId).emit("messageReceived", { firstName, text });
        console.log(firstName + " " + text);
      } catch (err) {
        console.log(err);
      }
    });
  });
};

module.exports = initializeSocket;
