import { Request, Response } from "express";
import { Payment } from "../models/payment";

// Create payment details
export const createPayment = async (req: Request, res: Response) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Error creating payment", error });
  }
};
// Get payment details by Order ID
export const getPaymentByOrderId = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res
        .status(404)
        .json({ message: "Payment not found for this order" });
    }

    res.status(200).json(payment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching payment by order ID", error });
  }
};

// Get all payments made by a Buyer
export const getPaymentsByBuyer = async (req: Request, res: Response) => {
  const { buyerId } = req.params;

  try {
    const payments = await Payment.find({ buyerId });
    if (!payments.length) {
      return res
        .status(404)
        .json({ message: "No payments found for this buyer" });
    }

    res.status(200).json(payments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching payments for buyer", error });
  }
};

// Get all payments received by a Seller
export const getPaymentsBySeller = async (req: Request, res: Response) => {
  const { sellerId } = req.params;

  try {
    const payments = await Payment.find({ sellerId });
    if (!payments.length) {
      return res
        .status(404)
        .json({ message: "No payments found for this seller" });
    }

    res.status(200).json(payments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching payments for seller", error });
  }
};
