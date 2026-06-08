const express = require("express");
// require express from node-modules
const connectDB = require("../src/config/database");
const User = require('./models/user')
const app = express();

app.use(express.json()); // Parse JSON request body

app.post('/signUp', async (req,res) => {
   
   const user  = new User(req.body)

   await user.save()
   res.send('User added Successfully')

})



// First coonected to DB ,after that start the server and listen the request on port 3000
connectDB()
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
