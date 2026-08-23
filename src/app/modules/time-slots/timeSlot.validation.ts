import { z } from "zod";

export const createTimeSlotValidationSchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),

  date: z.iso.datetime({ message: "Date must be a valid ISO datetime" }),

  startTime: z.iso.datetime({
    message: "Start time must be a valid ISO datetime",
  }),

  endTime: z.iso.datetime({ message: "End time must be a valid ISO datetime" }),
});

export const updateTimeSlotValidationSchema = z.object({
  date: z.iso
    .datetime({ message: "Date must be a valid ISO datetime" })
    .optional(),

  startTime: z.iso
    .datetime({ message: "Start time must be a valid ISO datetime" })
    .optional(),

  endTime: z.iso
    .datetime({ message: "End time must be a valid ISO datetime" })
    .optional(),
});
