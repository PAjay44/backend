const express = require("express");
// require express from node-modules
require("dotenv").config();
const connectDB = require("../src/config/database");
const cookieParser = require("cookie-parser");
const profileRouter = require("./routes/profile");
const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");
const passwordRouter = require("./routes/password");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
// cors middleware to resolve cors issue btween two different domain+port.
// whitelist the domain URL, to set the token in cookie in browser,otherwise browser,axios will not allow to set the token in cookie.
// set withCredentials true
app.use(express.json());
app.use(cookieParser());
// Middleware that parses incoming JSON request bodies.
// It converts JSON data into a JavaScript object
// and stores it in req.body before passing control
// to the next route handler.

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", passwordRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);


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
