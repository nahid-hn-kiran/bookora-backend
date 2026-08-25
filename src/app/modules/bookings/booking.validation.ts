import { z } from "zod";

export const createBookingValidationSchema = z.object({
  timeSlotId: z.string().min(1, "Time slot ID is required"),

  guestCount: z
    .number()
    .int("Guest count must be an integer")
    .min(1, "Guest count must be at least 1"),

  notes: z.string().optional(),
});

export const updateBookingStatusValidationSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
});

export const getBookingsQueryValidationSchema = z.object({
  page: z.coerce.number().int().min(1).optional(),

  limit: z.coerce.number().int().min(1).max(100).optional(),

  search: z.string().optional(),

  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
});
