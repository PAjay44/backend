const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const User = require("../models/user");

const socketAuth = async (socket, next) => {
  try {
    // Get cookies from the Socket.IO handshake
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");

    const token = cookies.token;

    if (!token) {
      return next(new Error("Please Login"));
    }

    // Verify JWT
    const decoded = jwt.verify(token, "DevTinder@#123");

    // Find user
    const user = await User.findById(decoded._id);

    if (!user) {
      return next(new Error("User Not Found"));
    }

    // Attach user to the socket
    socket.user = user;

    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
};

module.exports = { socketAuth };