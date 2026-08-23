import status from "http-status";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/appError";

import { ICreateBooking, IUpdateBookingStatus } from "./booking.interface";

const generateBookingNumber = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const random = Math.floor(100000 + Math.random() * 900000);

  return `BK-${year}${month}${day}-${random}`;
};

const createBooking = async (userId: string, payload: ICreateBooking) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found.");
  }

  if (user.isDeleted || user.status !== "ACTIVE") {
    throw new AppError(
      status.FORBIDDEN,
      "Your account is not allowed to create a booking.",
    );
  }

  const timeSlot = await prisma.timeSlot.findUnique({
    where: {
      id: payload.timeSlotId,
    },

    include: {
      room: true,
    },
  });

  if (!timeSlot) {
    throw new AppError(status.NOT_FOUND, "Time slot not found.");
  }

  if (timeSlot.room.isDeleted) {
    throw new AppError(
      status.NOT_FOUND,
      "The room for this time slot is no longer available.",
    );
  }

  if (timeSlot.room.status !== "ACTIVE") {
    throw new AppError(
      status.BAD_REQUEST,
      "The room for this time slot is currently unavailable.",
    );
  }

  if (payload.guestCount > timeSlot.room.capacity) {
    throw new AppError(
      status.BAD_REQUEST,
      `This room can accommodate a maximum of ${timeSlot.room.capacity} guests.`,
    );
  }

  if (timeSlot.startTime <= new Date()) {
    throw new AppError(
      status.BAD_REQUEST,
      "This time slot has already started or passed.",
    );
  }

  const existingBooking = await prisma.booking.findUnique({
    where: {
      timeSlotId: payload.timeSlotId,
    },
  });

  if (existingBooking) {
    throw new AppError(status.CONFLICT, "This time slot is already booked.");
  }

  const totalAmount = timeSlot.room.price;

  const booking = await prisma.$transaction(async (transaction) => {
    const createdBooking = await transaction.booking.create({
      data: {
        bookingNumber: generateBookingNumber(),

        userId,

        timeSlotId: timeSlot.id,

        guestCount: payload.guestCount,

        totalAmount,

        status: "PENDING",

        notes: payload.notes,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        timeSlot: {
          include: {
            room: {
              include: {
                venue: true,
              },
            },
          },
        },
      },
    });

    return createdBooking;
  });

  return booking;
};

const getMyBookings = async (userId: string) => {
  const bookings = await prisma.booking.findMany({
    where: {
      userId,
    },

    include: {
      timeSlot: {
        include: {
          room: {
            include: {
              venue: true,
            },
          },
        },
      },

      payment: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
};

const getBookingById = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId,
    },

    include: {
      timeSlot: {
        include: {
          room: {
            include: {
              venue: true,
            },
          },
        },
      },

      payment: true,
    },
  });

  if (!booking) {
    throw new AppError(status.NOT_FOUND, "Booking not found.");
  }

  return booking;
};

const getAllBookings = async () => {
  const bookings = await prisma.booking.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      timeSlot: {
        include: {
          room: {
            include: {
              venue: true,
            },
          },
        },
      },

      payment: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return bookings;
};

const cancelBooking = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId,
    },
  });

  if (!booking) {
    throw new AppError(status.NOT_FOUND, "Booking not found.");
  }

  if (booking.status === "CANCELLED") {
    throw new AppError(status.BAD_REQUEST, "Booking is already cancelled.");
  }

  if (booking.status === "COMPLETED") {
    throw new AppError(
      status.BAD_REQUEST,
      "A completed booking cannot be cancelled.",
    );
  }

  const updatedBooking = await prisma.booking.update({
    where: {
      id: bookingId,
    },

    data: {
      status: "CANCELLED",
    },

    include: {
      timeSlot: {
        include: {
          room: true,
        },
      },

      payment: true,
    },
  });

  return updatedBooking;
};

const updateBookingStatus = async (
  bookingId: string,
  payload: IUpdateBookingStatus,
) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new AppError(status.NOT_FOUND, "Booking not found.");
  }

  if (booking.status === "CANCELLED") {
    throw new AppError(
      status.BAD_REQUEST,
      "A cancelled booking cannot be updated.",
    );
  }

  if (booking.status === "COMPLETED" && payload.status !== "COMPLETED") {
    throw new AppError(
      status.BAD_REQUEST,
      "A completed booking cannot change its status.",
    );
  }

  const updatedBooking = await prisma.booking.update({
    where: {
      id: bookingId,
    },

    data: {
      status: payload.status,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      timeSlot: {
        include: {
          room: true,
        },
      },

      payment: true,
    },
  });

  return updatedBooking;
};

export const bookingService = {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  cancelBooking,
  updateBookingStatus,
};
