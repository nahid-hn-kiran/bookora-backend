import { prisma } from "../../../lib/prisma";
import { ICreateRoom, IUpdateRoom } from "./room.interface";

const createRoom = async (payload: ICreateRoom) => {
  const venue = await prisma.venue.findFirst({
    where: {
      id: payload.venueId,
      isDeleted: false,
    },
  });

  if (!venue) {
    throw new Error("Venue not found.");
  }

  const room = await prisma.room.create({
    data: {
      name: payload.name,
      description: payload.description,
      capacity: payload.capacity,
      price: payload.price,
      duration: payload.duration,
      difficulty: payload.difficulty,
      image: payload.image,
      status: payload.status,
      venueId: payload.venueId,
    },
    include: {
      venue: true,
    },
  });

  return room;
};

const getAllRooms = async (query: { venueId?: string; status?: string }) => {
  const rooms = await prisma.room.findMany({
    where: {
      isDeleted: false,

      ...(query.venueId && {
        venueId: query.venueId,
      }),

      ...(query.status && {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        status: query.status as any,
      }),
    },

    include: {
      venue: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return rooms;
};

const getRoomById = async (roomId: string) => {
  const room = await prisma.room.findFirst({
    where: {
      id: roomId,
      isDeleted: false,
    },

    include: {
      venue: true,
    },
  });

  if (!room) {
    throw new Error("Room not found.");
  }

  return room;
};

const updateRoom = async (roomId: string, payload: IUpdateRoom) => {
  const existingRoom = await prisma.room.findFirst({
    where: {
      id: roomId,
      isDeleted: false,
    },
  });

  if (!existingRoom) {
    throw new Error("Room not found.");
  }

  const room = await prisma.room.update({
    where: {
      id: roomId,
    },

    data: payload,

    include: {
      venue: true,
    },
  });

  return room;
};

const deleteRoom = async (roomId: string) => {
  const existingRoom = await prisma.room.findFirst({
    where: {
      id: roomId,
      isDeleted: false,
    },
  });

  if (!existingRoom) {
    throw new Error("Room not found.");
  }

  const room = await prisma.room.update({
    where: {
      id: roomId,
    },

    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return room;
};

export const roomService = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
};
