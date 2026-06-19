const mongoose = require("mongoose");
const User = require("./user");

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User"
      // ref fun it build relation between collections,and we can refer to that collection and populate data
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:'User'
    },

    status: {
      type: String,
      enum: ["interested", "ignored", "accepted", "rejected"],
      message: `{VALUE} is incorrect status  type`,
    },
  },
  { timeStamps: true },
);

connectionRequestSchema.pre("save", function(){
    // this is a pre function ,a middleware ,it can run before the document saving into the db
    const connectionRequestSchema = this

    // check weather toUser as same as fromUserId
    if(connectionRequestSchema.fromUserId.equals(connectionRequestSchema.toUserId)){
        throw new Error(' cannot sent connectionRequestion by yourself !')
    }
    
})

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequest;
