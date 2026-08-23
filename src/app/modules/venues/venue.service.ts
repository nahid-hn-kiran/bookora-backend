import status from "http-status";
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import { ICreateVenue, IUpdateVenue, IVenueQuery } from "./venue.interface";

const createVenue = async (payload: ICreateVenue) => {
  const existingVenue = await prisma.venue.findFirst({
    where: {
      name: payload.name,
      isDeleted: false,
    },
  });

  if (existingVenue) {
    throw new AppError(
      status.CONFLICT,
      "A venue with this name already exists.",
    );
  }

  const venue = await prisma.venue.create({
    data: {
      name: payload.name,
      description: payload.description,
      address: payload.address,
      city: payload.city,
      country: payload.country,
      phone: payload.phone,
      email: payload.email,
      image: payload.image,
    },
  });

  return venue;
};

const getVenues = async (query: IVenueQuery) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  const skip = (page - 1) * limit;

  const where: Prisma.VenueWhereInput = {
    isDeleted: false,
  };

  if (query.search) {
    where.OR = [
      {
        name: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        city: {
          contains: query.search,
          mode: "insensitive",
        },
      },
      {
        country: {
          contains: query.search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (query.status) {
    where.status = query.status;
  }

  const [venues, total] = await prisma.$transaction([
    prisma.venue.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            rooms: true,
          },
        },
      },
    }),

    prisma.venue.count({
      where,
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: venues,
  };
};

const getVenueById = async (id: string) => {
  const venue = await prisma.venue.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      rooms: {
        where: {
          isDeleted: false,
        },
      },
    },
  });

  if (!venue) {
    throw new AppError(status.NOT_FOUND, "Venue not found.");
  }

  return venue;
};

const updateVenue = async (id: string, payload: IUpdateVenue) => {
  const existingVenue = await prisma.venue.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!existingVenue) {
    throw new AppError(status.NOT_FOUND, "Venue not found.");
  }

  if (payload.name && payload.name !== existingVenue.name) {
    const duplicateVenue = await prisma.venue.findFirst({
      where: {
        name: payload.name,
        id: {
          not: id,
        },
        isDeleted: false,
      },
    });

    if (duplicateVenue) {
      throw new AppError(
        status.CONFLICT,
        "A venue with this name already exists.",
      );
    }
  }

  const venue = await prisma.venue.update({
    where: {
      id,
    },
    data: payload,
  });

  return venue;
};

const deleteVenue = async (id: string) => {
  const venue = await prisma.venue.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!venue) {
    throw new AppError(status.NOT_FOUND, "Venue not found.");
  }

  const deletedVenue = await prisma.venue.update({
    where: {
      id,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return deletedVenue;
};

export const venueService = {
  createVenue,
  getVenues,
  getVenueById,
  updateVenue,
  deleteVenue,
};
