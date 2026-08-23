import status from "http-status";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import { ICreateTimeSlot, IUpdateTimeSlot } from "./timeSlot.interface";

const createTimeSlot = async (payload: ICreateTimeSlot) => {
  const room = await prisma.room.findFirst({
    where: {
      id: payload.roomId,
      isDeleted: false,
      status: "ACTIVE",
    },
  });

  if (!room) {
    throw new AppError(status.NOT_FOUND, "Room not found or inactive.");
  }

  const date = new Date(payload.date);
  const startTime = new Date(payload.startTime);
  const endTime = new Date(payload.endTime);

  if (startTime >= endTime) {
    throw new AppError(
      status.BAD_REQUEST,
      "Start time must be before end time.",
    );
  }

  const existingTimeSlot = await prisma.timeSlot.findFirst({
    where: {
      roomId: payload.roomId,
      startTime,
    },
  });

  if (existingTimeSlot) {
    throw new AppError(
      status.CONFLICT,
      "A time slot already exists for this room at this time.",
    );
  }

  const overlappingTimeSlot = await prisma.timeSlot.findFirst({
    where: {
      roomId: payload.roomId,

      startTime: {
        lt: endTime,
      },

      endTime: {
        gt: startTime,
      },
    },
  });

  if (overlappingTimeSlot) {
    throw new AppError(
      status.CONFLICT,
      "This time slot overlaps with an existing time slot.",
    );
  }

  const timeSlot = await prisma.timeSlot.create({
    data: {
      roomId: payload.roomId,
      date,
      startTime,
      endTime,
    },

    include: {
      room: true,
    },
  });

  return timeSlot;
};

const getAllTimeSlots = async (query: { roomId?: string; date?: string }) => {
  const timeSlots = await prisma.timeSlot.findMany({
    where: {
      ...(query.roomId && {
        roomId: query.roomId,
      }),

      ...(query.date && {
        date: new Date(query.date),
      }),
    },

    include: {
      room: true,
    },

    orderBy: {
      startTime: "asc",
    },
  });

  return timeSlots;
};

const getTimeSlotById = async (timeSlotId: string) => {
  const timeSlot = await prisma.timeSlot.findUnique({
    where: {
      id: timeSlotId,
    },

    include: {
      room: true,
      bookings: true,
    },
  });

  if (!timeSlot) {
    throw new AppError(status.NOT_FOUND, "Time slot not found.");
  }

  return timeSlot;
};

const updateTimeSlot = async (timeSlotId: string, payload: IUpdateTimeSlot) => {
  const existingTimeSlot = await prisma.timeSlot.findUnique({
    where: {
      id: timeSlotId,
    },

    include: {
      bookings: true,
    },
  });

  if (!existingTimeSlot) {
    throw new AppError(status.NOT_FOUND, "Time slot not found.");
  }

  if (existingTimeSlot.bookings.length > 0) {
    throw new AppError(
      status.BAD_REQUEST,
      "A booked time slot cannot be modified.",
    );
  }

  const date = payload.date ? new Date(payload.date) : existingTimeSlot.date;

  const startTime = payload.startTime
    ? new Date(payload.startTime)
    : existingTimeSlot.startTime;

  const endTime = payload.endTime
    ? new Date(payload.endTime)
    : existingTimeSlot.endTime;

  if (startTime >= endTime) {
    throw new AppError(
      status.BAD_REQUEST,
      "Start time must be before end time.",
    );
  }

  const overlappingTimeSlot = await prisma.timeSlot.findFirst({
    where: {
      roomId: existingTimeSlot.roomId,

      id: {
        not: timeSlotId,
      },

      startTime: {
        lt: endTime,
      },

      endTime: {
        gt: startTime,
      },
    },
  });

  if (overlappingTimeSlot) {
    throw new AppError(
      status.BAD_REQUEST,
      "This time slot overlaps with an existing time slot.",
    );
  }

  const timeSlot = await prisma.timeSlot.update({
    where: {
      id: timeSlotId,
    },

    data: {
      date,
      startTime,
      endTime,
    },

    include: {
      room: true,
    },
  });

  return timeSlot;
};

const deleteTimeSlot = async (timeSlotId: string) => {
  const existingTimeSlot = await prisma.timeSlot.findUnique({
    where: {
      id: timeSlotId,
    },

    include: {
      bookings: true,
    },
  });

  if (!existingTimeSlot) {
    throw new AppError(status.NOT_FOUND, "Time slot not found.");
  }

  if (existingTimeSlot.bookings.length > 0) {
    throw new AppError(
      status.BAD_REQUEST,
      "A booked time slot cannot be deleted.",
    );
  }

  await prisma.timeSlot.delete({
    where: {
      id: timeSlotId,
    },
  });

  return null;
};

export const timeSlotService = {
  createTimeSlot,
  getAllTimeSlots,
  getTimeSlotById,
  updateTimeSlot,
  deleteTimeSlot,
};
