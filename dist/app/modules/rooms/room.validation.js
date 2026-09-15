import { z } from "zod";
import { RoomStatus } from "../../../generated/prisma/enums";
export const createRoomValidationSchema = z.object({
    name: z.string().min(2, "Room name must be at least 2 characters long"),
    description: z.string().optional(),
    capacity: z.number().int().positive("Capacity must be greater than 0"),
    price: z.number().positive("Price must be greater than 0"),
    duration: z.number().int().positive("Duration must be greater than 0"),
    difficulty: z.string().optional(),
    image: z.url("Image must be a valid URL").optional(),
    status: z.enum(RoomStatus).optional(),
    venueId: z.string().min(1, "Venue ID is required"),
});
export const updateRoomValidationSchema = z.object({
    name: z
        .string()
        .min(2, "Room name must be at least 2 characters long")
        .optional(),
    description: z.string().optional(),
    capacity: z
        .number()
        .int()
        .positive("Capacity must be greater than 0")
        .optional(),
    price: z.number().positive("Price must be greater than 0").optional(),
    duration: z
        .number()
        .int()
        .positive("Duration must be greater than 0")
        .optional(),
    difficulty: z.string().optional(),
    image: z.url("Image must be a valid URL").optional(),
    status: z.enum(RoomStatus).optional(),
});
