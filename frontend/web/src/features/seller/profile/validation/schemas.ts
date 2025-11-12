import { z } from 'zod';

// Personal Information Schema
export const personalInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional().or(z.literal('')),
});

// Business Information Schema
export const businessInfoSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters').max(200).optional(),
  businessRegistrationNumber: z.string().optional(),
  taxId: z.string().optional(),
  businessAddress: z.string().max(500).optional(),
  businessDescription: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  businessCategory: z.string().optional(),
});

// Social Media Schema
export const socialMediaSchema = z.object({
  instagram: z.string().url('Invalid URL').optional().or(z.literal('')),
  facebook: z.string().url('Invalid URL').optional().or(z.literal('')),
  twitter: z.string().url('Invalid URL').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
});

// Password Change Schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Operating Hours Schema
const timeSchema = z.object({
  open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  closed: z.boolean().optional(),
});

export const operatingHoursSchema = z.object({
  monday: timeSchema.optional(),
  tuesday: timeSchema.optional(),
  wednesday: timeSchema.optional(),
  thursday: timeSchema.optional(),
  friday: timeSchema.optional(),
  saturday: timeSchema.optional(),
  sunday: timeSchema.optional(),
});

// Combined Profile Schema
export const profileSchema = personalInfoSchema.merge(businessInfoSchema).merge(z.object({
  socialMedia: socialMediaSchema.optional(),
  operatingHours: operatingHoursSchema.optional(),
}));

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type BusinessInfoFormData = z.infer<typeof businessInfoSchema>;
export type SocialMediaFormData = z.infer<typeof socialMediaSchema>;
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
export type OperatingHoursFormData = z.infer<typeof operatingHoursSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;

