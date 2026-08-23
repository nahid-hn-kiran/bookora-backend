import { z } from "zod";

const createVenueValidationSchema = z.object({
  name: z
    .string()
    .min(2, "Venue name must be at least 2 characters")
    .max(100, "Venue name cannot exceed 100 characters"),

  description: z
    .string()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),

  address: z
    .string()
    .min(3, "Address is required")
    .max(300, "Address cannot exceed 300 characters"),

  city: z
    .string()
    .min(2, "City is required")
    .max(100, "City cannot exceed 100 characters"),

  country: z
    .string()
    .min(2, "Country is required")
    .max(100, "Country cannot exceed 100 characters"),

  phone: z.string().optional(),

  email: z.email("Invalid email address").optional(),

  image: z.url("Invalid image URL").optional(),
});

const updateVenueValidationSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),

    description: z.string().max(1000).optional(),

    address: z.string().min(3).max(300).optional(),

    city: z.string().min(2).max(100).optional(),

    country: z.string().min(2).max(100).optional(),

    phone: z.string().optional(),

    email: z.email("Invalid email address").optional(),

    image: z.url("Invalid image URL").optional(),

    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for update",
  });

export const venueValidation = {
  createVenueValidationSchema,
  updateVenueValidationSchema,
};
