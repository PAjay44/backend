
const express = require('express')
// require express from node-modules

const app= express()

app.get('/user',(req,res,next) => {
    // res.send('successfully get user data')
    // is a request handler because it executes every time a request comes to /.
    next()
},(req,res,next) => {
    // res.send('2nd response')
    next()

},(req,res,next) => {
    // res.send('3rd response')
    next()

},(req,res,next) => {
    // res.send('4th response')
    next()
},(req,res,next) => {
    res.send('5th response')
    })

app.listen(3000, () => {
    console.log('server is running on port 3000')
})
// When we call app.listen(3000),Express creates an HTTP server internally and starts listening for incoming requests on port 3000.
