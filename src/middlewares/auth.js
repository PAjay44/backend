const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    // cookies parser parse the cookie into JS obj, which can understand our api
    if (!token) {
      throw new Error("Invalid token");
    }

    const decodedMessage = jwt.verify(token, "DevTinder@#123");

    // signature header+payload+secret key
    // From the token it extract header,payload and create a new with secret key and client signature===my signature
    // After verifies sign, decode the payload and get user detail through the information in payload

    const { _id } = decodedMessage;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User Not Found");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = { userAuth };
