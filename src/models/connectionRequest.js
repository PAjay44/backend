const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    status: {
      type: String,
      enum: ["interested", "ignored", "accepeted", "rejected"],
      message: `{VALUE} is incorrect status  type`,
    },
  },
  { timeStamp: true },
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
