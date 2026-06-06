
const express = require('express')
// require express from node-modules

const {adminAuth} = require("./middlewares/auth")
const app= express()

app.use('/admin',adminAuth)


app.use('/user', (req,res,next) => {
    res.send('get all users')
    // next()
})

app.use('/admin/getAllData', (req,res) => {
    res.send('get all data')
})

app.use('/admin/delete', (req,res) => {
    res.send('delete all data')
})


app.listen(3000, () => {
    console.log('server is running on port 3000')
})
// When we call app.listen(3000),Express creates an HTTP server internally and starts listening for incoming requests on port 3000.
