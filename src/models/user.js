const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      // mandatory field for signup a user
      minLength: 4,
      maxLength: 50,
      index: true,
      // If we create an index on a field (for example, email),
      // the database doesn't need to scan every document/row.
      // When we query by email, the lookup becomes much faster
      // because the database uses the index data structure
      // (such as B-trees, hash indexes, etc.) to quickly locate
      // the matching records instead of performing a full table scan.
    },

    lastName: {
      type: String,
    },

    emailId: {
      type: String,
      required: true,
      unique: true, // unique email for new User
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid: ", +value);
        }
      },
    },

    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password:" + value);
        }
      },
    },

    gender: {
      type: String,
      validate(value) {
        // this is the custom validate function, It can run during new user creation only,
        // It will not run for already exist user for update, if we want we have add run validators in API's
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender is not Valid");
        }
      },
    },

    age: {
      type: String,
    },

    isPremium: {
      type: Boolean,
      default: false,
    },
    membershipType: {
      type: String,
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      // If not add photo , it will take this default photo
    },
    about: {
      type: String,
      default: "This is default about the user",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DevTinder@#123");
  return token;
};
// Instead of creating token we can do here attach to schema
// using schema methods make it reusable,we can use where ever we want
// we can attach some methods to this schema ,which is related to User,
// these are helper methods, that is related to user
// whenever we create new instance of that model, the documents all are the instances of this model
// when I refer "this" equal to the user, that represents that particular instance.
// when we call User.jwt method the user is Ajay and it will create jwt for that user

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const hashPassword = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    hashPassword,
  );
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
// We create the User model one time. It acts as a blueprint based on the schema.
// Every time a new user comes, we create a new User instance/document from this model.
// Schema = What fields a User has.
// Model = Blueprint/Class created from the schema.
