
const adminAuth = (req,res,next) => {

    const token ='xyz'

     const isAdminauthroised = token==="xyz"
     if(!isAdminauthroised){
        res.status(401).send('Unauthorized request')
     }else{
        next()
     }

}

module.exports={adminAuth}