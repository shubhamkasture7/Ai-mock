// pages/api/create-razorpay-order.js

import Razorpay from "razorpay";

const razorpayInstance = new Razorpay({
  key_id: "rzp_test_IYDnqorPRMnVxZ", // Your Razorpay API key
  key_secret: "uvnOeNOmYDLE2t7mLKxuuDm1", // Your Razorpay Secret key
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { planName, amount } = req.body;

    try {
      const order = await razorpayInstance.orders.create({
        amount: parseInt(amount.replace("₹", "").replace(",", "")) * 100, // Convert amount to paise
        currency: "INR",
        receipt: `order_rcptid_${Math.floor(Math.random() * 1000)}`,
        notes: {
          planName,
        },
      });

      res.status(200).json({
        orderId: order.id,
        amount: amount.replace("₹", "").replace(",", ""),
      });
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({ error: "Error creating Razorpay order" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
