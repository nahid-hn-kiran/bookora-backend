import { prisma } from "../../../lib/prisma";
import { paymentUtils } from "../payment/payment.utils";

const expirePendingBookings = async (timeSlotId?: string) => {
  const now = new Date();

  const expiredBookings = await prisma.booking.findMany({
    where: {
      status: "PENDING",

      ...(timeSlotId && {
        timeSlotId,
      }),

      expiresAt: {
        lte: now,
      },
    },

    include: {
      payment: true,
    },
  });

  if (expiredBookings.length === 0) {
    return;
  }

  for (const booking of expiredBookings) {
    try {
      await paymentUtils.releaseStripePayment(booking.id, booking.payment);

      await prisma.$transaction(async (transaction) => {
        const currentBooking = await transaction.booking.findUnique({
          where: {
            id: booking.id,
          },
        });

        if (!currentBooking || currentBooking.status !== "PENDING") {
          return;
        }

        await transaction.booking.update({
          where: {
            id: booking.id,
          },

          data: {
            status: "CANCELLED",
          },
        });

        if (booking.payment) {
          await transaction.payment.update({
            where: {
              id: booking.payment.id,
            },

            data: {
              status: "FAILED",
            },
          });
        }
      });

      console.log(`Booking expired: ${booking.bookingNumber}`);
    } catch (error) {
      console.error(
        `Failed to expire booking ${booking.bookingNumber}:`,
        error,
      );
    }
  }
};

export const bookingExpiryService = {
  expirePendingBookings,
};
