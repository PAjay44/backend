const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  emailId: {
    type: String,
  },
  otp: {
    type: Number,
  },
  expiresAt: {
    type: Date,
    index: { expires: 0 },
    // "When the time stored in expiresAt is reached 0, this document is eligible for deletion."
  },
});

const Otp = new mongoose.model("forGotPassword", otpSchema);

module.exports = Otp;
