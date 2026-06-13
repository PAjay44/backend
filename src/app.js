const express = require("express");
// require express from node-modules
const connectDB = require("../src/config/database");
const cookieParser = require("cookie-parser");
const profileRouter = require("./routes/profile");
const authRouter = require("./routes/auth");
// const authRouter = require("./routes/auth");
// const profileRouter = require("./routes/profile");
const app = express();

app.use(express.json());
app.use(cookieParser());
// Middleware that parses incoming JSON request bodies.
// It converts JSON data into a JavaScript object
// and stores it in req.body before passing control
// to the next route handler.

app.use('/',authRouter)
app.use('/',profileRouter)


app.patch("/user/:id", async (req, res) => {
  // Dynamic params
  const userId = req.params?.id;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["age", "gender", "photoUrl", "skills", "about"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );
    // loop through each key in obj from data and every key must includes in allowed updates

    if (!isUpdateAllowed) {
      throw new Error("update not allowed");
    }

    if (data.skills.length > 15) {
      throw new Error("Greater than 15 skills not allowed to add");
    }

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
