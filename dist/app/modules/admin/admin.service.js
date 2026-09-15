import status from "http-status";
import { Role, UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/appError";
const getAllUsers = async (query) => {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = Number((page - 1) * limit);
    const andConditions = [
        {
            role: Role.USER,
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
    const where = {
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
                image: true,
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
const getUserById = async (id) => {
    const user = await prisma.user.findFirst({
        where: {
            id,
            role: Role.USER,
            isDeleted: false,
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
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
const updateUser = async (id, payload) => {
    const existingUser = await prisma.user.findFirst({
        where: {
            id,
            role: Role.USER,
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
            image: payload.profilePhoto,
            status: payload.status,
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            status: true,
            role: true,
            isDeleted: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return updatedUser;
};
const deleteUser = async (id) => {
    const existingUser = await prisma.user.findFirst({
        where: {
            id,
            role: Role.USER,
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
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                status: true,
                role: true,
                isDeleted: true,
                deletedAt: true,
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
        where: {
            isDeleted: false,
        },
        select: {
            id: true,
            contactNumber: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    status: true,
                    isDeleted: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    console.log(admins);
    return admins;
};
const getAdminById = async (id) => {
    const admin = await prisma.admin.findFirst({
        where: {
            id,
            isDeleted: false,
        },
        select: {
            id: true,
            contactNumber: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    role: true,
                    status: true,
                    isDeleted: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
        },
    });
    if (!admin) {
        throw new AppError(status.NOT_FOUND, "Admin or Super Admin not found.");
    }
    return admin;
};
const updateAdmin = async (id, payload) => {
    const existingAdmin = await prisma.admin.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!existingAdmin) {
        throw new AppError(status.NOT_FOUND, "Admin or Super Admin not found.");
    }
    const result = await prisma.$transaction(async (tx) => {
        if (payload.admin) {
            await tx.admin.update({
                where: {
                    id,
                },
                data: {
                    contactNumber: payload.admin.contactNumber,
                },
            });
            await tx.user.update({
                where: {
                    id: existingAdmin.userId,
                },
                data: {
                    name: payload.admin.name,
                    image: payload.admin.profilePhoto,
                },
            });
        }
        return tx.admin.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                contactNumber: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                        role: true,
                        status: true,
                        isDeleted: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
    });
    return result;
};
const deleteAdmin = async (id, user) => {
    const existingAdmin = await prisma.admin.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!existingAdmin) {
        throw new AppError(status.NOT_FOUND, "Admin or Super Admin not found.");
    }
    if (existingAdmin.userId === user.id) {
        throw new AppError(status.BAD_REQUEST, "You cannot delete yourself.");
    }
    const result = await prisma.$transaction(async (tx) => {
        await tx.admin.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        });
        const deletedUser = await tx.user.update({
            where: {
                id: existingAdmin.userId,
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: UserStatus.DELETED,
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
                status: true,
                isDeleted: true,
                deletedAt: true,
            },
        });
        await tx.session.deleteMany({
            where: {
                userId: existingAdmin.userId,
            },
        });
        await tx.account.deleteMany({
            where: {
                userId: existingAdmin.userId,
            },
        });
        return deletedUser;
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
