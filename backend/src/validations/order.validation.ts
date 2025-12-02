/**
 * Order Validation Schemas
 */

import Joi from "joi";

export const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        sellerId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
        title: Joi.string().required(),
        image: Joi.string().uri().optional(),
        price: Joi.number().min(0).required(),
        quantity: Joi.number().integer().min(1).max(1000).required(),
        subtotal: Joi.number().min(0).required(),
        variant: Joi.object().optional(),
      })
    )
    .min(1)
    .max(50)
    .required()
    .messages({
      "array.min": "Order must contain at least 1 item",
      "array.max": "Order cannot contain more than 50 items",
    }),

  totalPrice: Joi.number().min(0).max(1000000).required(),

  tax: Joi.number().min(0).optional(),
  shippingCost: Joi.number().min(0).optional(),
  discount: Joi.number().min(0).optional(),

  shippingAddress: Joi.object({
    fullName: Joi.string().min(2).max(100).required(),
    phoneNumber: Joi.string().required(),
    addressLine1: Joi.string().min(5).max(200).required(),
    addressLine2: Joi.string().max(200).optional(),
    city: Joi.string().min(2).max(100).required(),
    postalCode: Joi.string().min(3).max(20).required(),
    country: Joi.string().min(2).max(100).required(),
  }).required(),

  paymentMethod: Joi.string().valid("paypal", "stripe", "cash").required(),
  paymentId: Joi.string().max(200).optional(),
  customerNote: Joi.string().max(500).optional(),
});

export const updateTrackingSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "canceled")
    .required(),
  location: Joi.string().max(200).optional(),
  note: Joi.string().max(500).optional(),
  trackingNumber: Joi.string().max(100).optional(),
  carrier: Joi.string().max(100).optional(),
});

export const orderQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string()
    .valid("pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "canceled", "all")
    .default("all"),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).optional(),
});

