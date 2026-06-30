const { validateSignUpData } = require("../utils/validation");
const { getJWT } = require("../models/user");
const { validatePassword } = require("../models/user");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const express = require("express");
const authRouter = express.Router();
// use express router which is used to manage api's cleaner,structure,moduler
// logically separate the api's and group them and create routers for them
// app.use === router.use are same

authRouter.post("/signUp", async (req, res) => {
  try {
    // validation for data from req
    // useful before creating document and validate the data

    validateSignUpData(req);

    // step-2 Encrypt passwords

    const { firstName, lastName, password, emailId } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      password: hashPassword,
      emailId,
    });
    // create a new Instance of User model using the data from the req
    await user.save();
    res.send("User added Successfully");
  } catch (err) {
    res.status(400).send("Error message:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    const { _id } = user;
    if (!user) {
      throw new Error("Invalid credentials");
      // we should not tell email does not exist in DB it just like data leaking
      // we just sendInvalid credentials
    }

    const isPasswordValid = await user.validatePassword(password);
    // bcrypt.compare using this we compare the req password and in DB password

    const token = await user.getJWT();

    res.cookie("token", token, {
      httpOnly: true,
    });

    if (isPasswordValid) {
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  // this api simple, In companies we can do some clean up things,before logout
  res.clearCookie("token").send("Logout successfully");
});

module.exports = authRouter;
