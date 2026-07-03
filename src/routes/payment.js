const express = require("express");
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorPayment");
const Payment = require("../models/payment");
const memberShipAmount = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");
const user = require("../models/user");

const paymentRouter = express.Router();

paymentRouter.post("/payment/create-order", userAuth, async (req, res) => {
  try {
    const { memberShipType } = req.body;
    const { firstName, lastName, emailId, _id } = req.user;
    console.log(req.body);

    const order = await razorpayInstance.orders.create({
      //create an order by calling razorpay using razorpay instance, and it will return a promise

      amount: memberShipAmount[memberShipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      // meta data
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType: memberShipType,
      },
    });

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedUser = await payment.save();
    res.json({ ...savedUser.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error(err);
    console.log(err.error);
    console.log(err.statusCode);
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  console.log("Webhook Hit");
  console.log("Event:", req.body.event);
  console.log(req.body.payload.payment.entity);
  // Don't use userAuth middleware because Razorpay is calling this webhook,
  // not a logged-in user.

  // In the Razorpay Dashboard, create a webhook, select events like
  // payment.captured and payment.failed, and provide this webhook URL.

  // Whenever one of those events occurs, Razorpay sends a POST request
  // to this endpoint. After validating the webhook, update the database
  // based on the event.

  // validateWebhookSignature() is provided by Razorpay to verify that
  // the webhook request is genuinely from Razorpay and hasn't been tampered with.

  // Razorpay generates an HMAC SHA256 signature using:
  // Webhook Body + Webhook Secret,
  // and sends it in the X-Razorpay-Signature header.

  // Here, validateWebhookSignature() generates the same HMAC hash using
  // req.body and our Webhook Secret, then compares it with the
  // X-Razorpay-Signature sent by Razorpay.

  // If both hashes match, the webhook is authentic and safe to process.

  // "We validate the webhook signature to ensure the request is genuinely sent by Razorpay and that the request body hasn't been tampered with during transit."

  try {
    const webhookSignature = req.get("X-Razorpay-Signature");
    console.log("Webhook Signature", webhookSignature);

    const iswebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );

    if (!iswebhookValid) {
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }

    console.log(req.body.payload);
    const paymentDetails = req.body.payload.payment.entity;
    console.log(paymentDetails);
    console.log("Payment Details:", paymentDetails.id);
    // get the paymeny details
    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    // from paymentDetails take the orderId, and find that orderId in our payment collections
    // if orderId found make payment status equal to paymentDetails.status
    if (!payment) {
      return res.status(404).json({
        message: "Payment record not found",
      });
    }
    payment.status = paymentDetails.status;
    payment.paymentId = paymentDetails.id;
    console.log("Saved Payment:", payment);

    if (req.body.event == "payment.captured") {
      const user = await User.findOne({ _id: payment.userId });

      user.isPremium = true;
      user.membershipType = payment.notes.membershipType;
      await user.save();
    }

    if (req.body.event === "payment.failed") {
      payment.status = "failed";
    }

    await payment.save();

    return res.status(200).json({ msg: "Webhook received successfully" });
    // we have to send this msg to razorpay,otherwise  it's keep on calling our API
  } catch (err) {
    console.log(err);
  }
});

paymentRouter.get("/verify/payment/", userAuth, async (req, res) => {
  try {
    const paymentDetails = await Payment.findOne({ userId: req.user._id }).sort(
      { createdAt: -1 },
    );
    // Sort the documents by createdAt in descending order (newest first).
    res.json(paymentDetails);
  } catch (err) {
    res.status(500).send("paymentDetails not found");
  }
});

module.exports = paymentRouter;
