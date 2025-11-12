import { z } from 'zod';

/**
 * Common validation schemas using Zod
 */

export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(50, 'Password must be less than 50 characters');

export const requiredStringSchema = z.string().min(1, 'This field is required');

export const urlSchema = z.string().url('Invalid URL');

export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number');

export const priceSchema = z.number().positive('Price must be positive').or(
  z.string().transform((val) => {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) throw new Error('Invalid price');
    return num;
  })
);

export const quantitySchema = z.number().int().positive('Quantity must be a positive integer').or(
  z.string().transform((val) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num <= 0) throw new Error('Invalid quantity');
    return num;
  })
);

/**
 * Validation helper functions
 */

export const isValidEmail = (email: string): boolean => {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
};

export const isValidUrl = (url: string): boolean => {
  try {
    urlSchema.parse(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidPrice = (price: number | string): boolean => {
  try {
    priceSchema.parse(price);
    return true;
  } catch {
    return false;
  }
};

