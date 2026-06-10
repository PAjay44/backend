const { mongoose } = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    // mandatory field for signup a user
    minLength: 4, 
    maxLength: 50
  },

  lastName:{
    type:String,
  },

  emailId:{
    type: String,
    required: true,
    unique: true // unique email for new User
  },

  password:{
    type:String,
    required:true
  },

  age:{
    type:String,
  },

  gender:{
    type:String,
    validate(value) {
      // this is the custom validate function, It can run during new user creation only,
      // It will not run for already exist user for update, if we want we have add run validators in API's
      if(!["male","female","others"].includes(value)){
        throw new Error('Gender is not Valid')
      }
    },
  },
  photoUrl:{
    type: String,
    default:'https://hostalitecloud.com/crb/speaker/fredric-martin/'
    // If not add photo , it will take this default photo 
  },
  about:{
    type: String,
    default:'This is default about the user'
  },
  skills:{
    type:[String]
  }
},{
  timestamps: true
});
  
// We create the User model one time. It acts as a blueprint based on the schema.
// Every time a new user comes, we create a new User instance/document from this model.
// Schema = What fields a User has.
// Model = Blueprint/Class created from the schema.
 module.exports = mongoose.model('User', userSchema)
