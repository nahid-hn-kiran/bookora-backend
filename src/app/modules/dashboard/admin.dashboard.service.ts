import { prisma } from "../../../lib/prisma";

const getDashboardStats = async () => {
  const [
    totalUsers,
    totalAdmins,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    revenueResult,
    recentBookings,
  ] = await Promise.all([
    prisma.user.count({
      where: {
        role: "USER",
        isDeleted: false,
      },
    }),

    prisma.admin.count({
      where: {
        isDeleted: false,
      },
    }),

    prisma.booking.count(),

    prisma.booking.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.booking.count({
      where: {
        status: "CONFIRMED",
      },
    }),

    prisma.booking.count({
      where: {
        status: "COMPLETED",
      },
    }),

    prisma.booking.count({
      where: {
        status: "CANCELLED",
      },
    }),

    prisma.payment.aggregate({
      where: {
        status: "PAID",
      },

      _sum: {
        amount: true,
      },
    }),

    prisma.booking.findMany({
      take: 10,

      orderBy: {
        createdAt: "desc",
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

        payment: true,
      },
    }),
  ]);

  return {
    users: {
      total: totalUsers,
    },

    admins: {
      total: totalAdmins,
    },

    bookings: {
      total: totalBookings,
      pending: pendingBookings,
      confirmed: confirmedBookings,
      completed: completedBookings,
      cancelled: cancelledBookings,
    },

    revenue: {
      total: revenueResult._sum.amount ?? 0,
    },

    recentBookings,
  };
};

export const AdminDashboardService = {
  getDashboardStats,
};
