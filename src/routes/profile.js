const { userAuth } = require("../middlewares/auth");
const { validationEditProfileData } = require("../utils/validation");
const express = require("express");
const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
  try {
    if (!validationEditProfileData(req)) {
      throw new Error("update not allowed");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.send(`${loggedInUser.firstName}, your Profile Updated Successfully`);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
