const express = require("express");
// require express from node-modules
const connectDB = require("../src/config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());
// Middleware that parses incoming JSON request bodies.
// It converts JSON data into a JavaScript object
// and stores it in req.body before passing control
// to the next route handler.

app.post("/signUp", async (req, res) => {
  const user = new User(req.body);
  // create a new Instance of User model using the data from the req
  try {
    await user.save();
    res.send("User added Successfully");
  } catch (err) {
    res.status(400).send("Error message:" + err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    // get the users by using model name of that data
    res.send(users);
  } catch (err) {
    res.status(400).send("user not found");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Users not Found");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  console.log(userId);
  try {
    await User.findByIdAndDelete(userId);
    res.send("user deleted successfully");
  } catch (err) {
    res.status(400).send("Failed to delete user");
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  console.log(userId);
  console.log(data);
  try {
    const beforeData = await User.findOneAndUpdate({ _id: userId }, data, {
      returnDocument: "before",
      runValidators: true,
    });
    //  const beforeData=await  User.findOneAndUpdate({emailId:emailId},data,{returnDocument:"before"} )
    console.log(beforeData);
    res.send("user updated successfully");
  } catch (err) {
    res.status(400).send("Error Occured:" + err.message);
  }
});

connectDB()
  // First coonected to DB ,after that start the server and listen the request on port 3000
  .then(() => {
    console.log("Database connection established");
    app.listen(3000, () => {
      console.log("server is running on port 3000");
    });
  })
  .catch(() => {
    console.log("Database connection cannot be established..!!");
  });

// When we call app.listen(3000),Express creates an HTTP server internally and starts listening for incoming requests on port 3000.
