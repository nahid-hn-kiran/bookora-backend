import { z } from "zod";
export const createPaymentIntentValidationSchema = z.object({
    bookingId: z.string().min(1, "Booking ID is required"),
});
export const createCheckoutSessionValidationSchema = z.object({
    bookingId: z.string().min(1, "Booking ID is required"),
});
