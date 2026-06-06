const express = require('express')
// require express from node-modules

const app= express()


app.get('/user',(req,res) => {
//   try{  
    throw new Error('fffff')
    // res.send('user came')
// } catch(err){
//     res.status(500).send('contact support team')
// }
})

app.use('/', (err,req,res,next) => {
    res.status(500).send('something went  wrong')
    // created for unhandled error by default
}) 

app.listen(3000, () => {
    console.log('server is running on port 3000')
})
// When we call app.listen(3000),Express creates an HTTP server internally and starts listening for incoming requests on port 3000.
