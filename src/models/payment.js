const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      // fo each payment link to that actual user
      required: true,
    },
    paymentId: {
      type: String,
      // suppose you make an order but the but payment not done ,so dont make required field
    },
    orderId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    receipt: {
      type: String,
      required: true,
    },
    notes: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      membershipType: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Payment", paymentSchema);
