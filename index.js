import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";

// Load .env file for local development
dotenv.config();

// ✅ Must come before using it
const stripeKey = process.env.STRIPE_KEY ;

if (!stripeKey) {
  throw new Error("STRIPE_KEY is not defined in .env or Firebase config.");
}

const stripe = new Stripe(stripeKey); // ✅ now stripeKey is defined

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "success!" });
});

app.get("/payment/create", async (req, res) => {
  const total = req.query.total;
  if (total > 0) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
    });
    res.status(201).json({clientSecret: paymentIntent.client_secret});
  } else {
    res.status(401).json({ message: "total must be greater than 0" });
  }
});

app.listen(5002, (err) => {
  if (err) throw err;
  //console.log("Amazon Server Running on PORT: 5002, http://localhost:5002");
});
