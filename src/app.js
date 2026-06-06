
const express = require('express')
// require express from node-modules

const app= express()

app.get('/user/:id',(req,res) => {
    console.log(req.query)
    console.log(req.params)
    res.send('successfully get user data')
    // is a request handler because it executes every time a request comes to /.
})

app.listen(3000, () => {
    console.log('server is running on port 3000')
})
// When we call app.listen(3000),Express creates an HTTP server internally and starts listening for incoming requests on port 3000.
