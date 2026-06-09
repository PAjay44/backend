const { mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: "String",
  },

  lastName:{
    type:'String'
  },

  emailId:{
    type: 'String'
  },

  password:{
    type:'String'
  },

  age:{
    type:'String'
  },

  gender:{
    type:'String'
  }

});
  
// We create the User model one time. It acts as a blueprint based on the schema.
// Every time a new user comes, we create a new User instance/document from this model.
// Schema = What fields a User has.
// Model = Blueprint/Class created from the schema.
 module.exports = mongoose.model('User', userSchema)
