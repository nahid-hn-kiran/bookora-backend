import {
  app_default,
  envVars,
  prisma,
  stripe
} from "../chunk-PS7AFNKE.js";

// src/app/modules/bookings/booking.expiry.ts
var expirePendingBookings = async () => {
  const now = /* @__PURE__ */ new Date();
  const expiredBookings = await prisma.booking.findMany({
    where: {
      status: "PENDING",
      expiresAt: {
        lte: now
      }
    },
    include: {
      payment: true
    }
  });
  if (expiredBookings.length === 0) {
    return;
  }
  for (const booking of expiredBookings) {
    try {
      if (booking.payment?.paymentIntentId) {
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            booking.payment.paymentIntentId
          );
          if (paymentIntent.status === "requires_payment_method" || paymentIntent.status === "requires_confirmation" || paymentIntent.status === "requires_action") {
            await stripe.paymentIntents.cancel(paymentIntent.id);
          }
        } catch (error) {
          console.error(
            `Failed to cancel PaymentIntent for booking ${booking.id}:`,
            error
          );
        }
      }
      if (booking.payment?.checkoutSessionId) {
        try {
          const session = await stripe.checkout.sessions.retrieve(
            booking.payment.checkoutSessionId
          );
          if (session.status === "open") {
            await stripe.checkout.sessions.expire(session.id);
          }
        } catch (error) {
          console.error(
            `Failed to expire Checkout Session for booking ${booking.id}:`,
            error
          );
        }
      }
      await prisma.$transaction(async (transaction) => {
        const currentBooking = await transaction.booking.findUnique({
          where: {
            id: booking.id
          }
        });
        if (!currentBooking || currentBooking.status !== "PENDING") {
          return;
        }
        await transaction.booking.update({
          where: {
            id: booking.id
          },
          data: {
            status: "CANCELLED"
          }
        });
        if (booking.payment) {
          await transaction.payment.update({
            where: {
              id: booking.payment.id
            },
            data: {
              status: "FAILED"
            }
          });
        }
      });
      console.log(`Booking expired: ${booking.bookingNumber}`);
    } catch (error) {
      console.error(
        `Failed to expire booking ${booking.bookingNumber}:`,
        error
      );
    }
  }
};
var bookingExpiryService = {
  expirePendingBookings
};

// src/app/modules/bookings/booking.expiry.scheduler.ts
var startBookingExpiryScheduler = () => {
  bookingExpiryService.expirePendingBookings().catch((error) => {
    console.error("Initial booking expiry check failed:", error);
  });
  setInterval(async () => {
    try {
      await bookingExpiryService.expirePendingBookings();
    } catch (error) {
      console.error("Booking expiry scheduler failed:", error);
    }
  }, 60 * 1e3);
  console.log("Booking expiry scheduler started.");
};
var booking_expiry_scheduler_default = startBookingExpiryScheduler;

// src/server.ts
var server;
var bootstrap = async () => {
  try {
    server = app_default.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
      booking_expiry_scheduler_default();
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Shutting down server...");
  if (server) {
    server.close(() => {
      console.log("Server closed gracefully.");
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("SIGINT", () => {
  console.log("SIGINT signal received. Shutting down server...");
  if (server) {
    server.close(() => {
      console.log("Server closed gracefully.");
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception Detected... Shutting down server", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("unhandledRejection", (error) => {
  console.log("Unhandled Rejection Detected... Shutting down server", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
bootstrap();
