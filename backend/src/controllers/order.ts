import { Request, Response } from "express";
import { Order } from "../models/order"; // Assuming you have an Order model

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const order = new Order(req.body); // req.body should contain the order details
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error });
  }
};

// Get all orders for a specific buyer
export const getOrdersByBuyer = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ buyer: req.params.buyerId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

// Get all orders for a specific seller
export const getOrdersBySeller = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ seller: req.params.sellerId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

// Update the status of an order (for example, for delivery or cancellation updates)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status }, // Assuming req.body contains the updated status
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error });
  }
};

// Cancel an order
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const canceledOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" }, // Assuming you have a 'cancelled' status in the Order schema
      { new: true }
    );
    if (!canceledOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(canceledOrder);
  } catch (error) {
    res.status(500).json({ message: "Error cancelling order", error });
  }
};
