import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import {
  IGetUsersQuery,
  IUpdateAdminPayload,
  IUpdateUserPayload,
} from "./admin.interface";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import { IRequestUser } from "../../interfaces/requestUser";
import { Prisma } from "../../../generated/prisma/client";

const getAllUsers = async (query: IGetUsersQuery) => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  const andConditions: Prisma.UserWhereInput[] = [
    {
      role: "USER",
      isDeleted: false,
    },
  ];

  if (query.status) {
    andConditions.push({
      status: query.status,
    });
  }

  if (query.search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: query.search,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  const where: Prisma.UserWhereInput = {
    AND: andConditions,
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,

      skip,
      take: limit,

      select: {
        id: true,
        name: true,
        email: true,
        profilePhoto: true,
        status: true,
        role: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.user.count({
      where,
    }),
  ]);

  return {
    data: users,

    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id,
      role: "USER",
      isDeleted: false,
    },

    select: {
      id: true,
      name: true,
      email: true,
      profilePhoto: true,
      contactNumber: true,
      status: true,
      role: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError(status.NOT_FOUND, "User not found.");
  }

  return user;
};

const updateUser = async (id: string, payload: IUpdateUserPayload) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      id,
      role: "USER",
      isDeleted: false,
    },
  });

  if (!existingUser) {
    throw new AppError(status.NOT_FOUND, "User not found.");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },

    data: {
      name: payload.name,
      profilePhoto: payload.profilePhoto,
      contactNumber: payload.contactNumber,
      status: payload.status,
    },

    select: {
      id: true,
      name: true,
      email: true,
      profilePhoto: true,
      contactNumber: true,
      status: true,
      role: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const deleteUser = async (id: string) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      id,
      role: "USER",
      isDeleted: false,
    },
  });

  if (!existingUser) {
    throw new AppError(status.NOT_FOUND, "User not found.");
  }

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: {
        id,
      },

      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED,
      },
    });

    await tx.session.deleteMany({
      where: {
        userId: id,
      },
    });

    await tx.account.deleteMany({
      where: {
        userId: id,
      },
    });

    return user;
  });

  return result;
};

const getAllAdmins = async () => {
  const admins = await prisma.admin.findMany({
    include: {
      user: true,
    },
  });
  return admins;
};

const getAdminById = async (id: string) => {
  const admin = await prisma.admin.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
    },
  });
  return admin;
};

const updateAdmin = async (id: string, payload: IUpdateAdminPayload) => {
  const isAdminExist = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  if (!isAdminExist) {
    throw new AppError(status.NOT_FOUND, "Admin Or Super Admin not found");
  }

  const { admin } = payload;

  const updatedAdmin = await prisma.admin.update({
    where: {
      id,
    },
    data: {
      ...admin,
    },
  });

  return updatedAdmin;
};

const deleteAdmin = async (id: string, user: IRequestUser) => {
  const isAdminExist = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  if (!isAdminExist) {
    throw new AppError(status.NOT_FOUND, "Admin Or Super Admin not found");
  }

  if (isAdminExist.id === user.id) {
    throw new AppError(status.BAD_REQUEST, "You cannot delete yourself");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.admin.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.user.update({
      where: { id: isAdminExist.userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED,
      },
    });

    await tx.session.deleteMany({
      where: { userId: isAdminExist.userId },
    });

    await tx.account.deleteMany({
      where: { userId: isAdminExist.userId },
    });

    const admin = await getAdminById(id);

    return admin;
  });

  return result;
};

export const AdminService = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
