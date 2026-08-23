import { z } from "zod";

export const createBookingValidationSchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),

  timeSlotId: z.string().min(1, "Time slot ID is required"),

  bookingDate: z.string().datetime("Booking date must be a valid ISO datetime"),

  guestCount: z
    .number()
    .int("Guest count must be an integer")
    .min(1, "Guest count must be at least 1"),

  notes: z.string().optional(),
});

export const updateBookingStatusValidationSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
});
