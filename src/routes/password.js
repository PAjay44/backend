const express = require("express");
const crypto = require("crypto");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const Otp = require("../models/Otp");
const bcrypt = require("bcrypt");
const { sendOtpEmail } = require("../utils/nodeMailer");

const passwordRouter = express.Router();

passwordRouter.post("/forgotGotPassowrd", async (req, res) => {
  try {
    const { emailId } = req.body;
    const verifyEmail = await User.findOne({ emailId: emailId });

    if (!verifyEmail) {
      res.status(404).json({ message: "Email Not Found" });
    }

    const toManyOtp = await Otp.deleteMany({ emailId });
    const otp = crypto.randomInt(100000, 999999);

    const otpDoc = new Otp({
      emailId,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      // Stores Current Time = 10:00, expiresAt = 10:05
    });

    await otpDoc.save();
    await sendOtpEmail(emailId, otp);
    res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

passwordRouter.post("/verifyOtp", async (req, res) => {
  try {
    const { otp, emailId } = req.body;

    const otpRecord = await Otp.findOne({ otp, emailId });

    if (!otpRecord) {
      return res.status(404).json({ message: "Invalid Otp" });
    }

    if (otpRecord.expiresAt < new Date()) {
      res.status(404).json({ message: "OTP Expired" });
    }
    res.send("Otp Verified Successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

passwordRouter.patch("/changePassword", async (req, res) => {
  try {
    const { emailId, newPassword, confirmNewPassword } = req.body;
    const verifyEmail = await User.findOne({ emailId: emailId });

    if (!verifyEmail) {
      res.status(404).json({ message: "Email Not Found" });
    }

    if (newPassword !== confirmNewPassword) {
      res.status(404).json({ message: "password not match" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    verifyEmail.password = hashPassword;
    await verifyEmail.save();

    res.send("Password changed Successfully");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = passwordRouter;
