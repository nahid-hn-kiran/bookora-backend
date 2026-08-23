import status from "http-status";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errorHelpers/appError";
import { stripe } from "../../config/stripe";

const createPaymentIntent = async (userId: string, bookingId: string) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId,
    },

    include: {
      payment: true,

      timeSlot: {
        include: {
          room: true,
        },
      },
    },
  });

  if (!booking) {
    throw new AppError(status.NOT_FOUND, "Booking not found.");
  }

  if (booking.status === "CANCELLED") {
    throw new AppError(
      status.BAD_REQUEST,
      "A cancelled booking cannot be paid for.",
    );
  }

  if (booking.status === "COMPLETED") {
    throw new AppError(
      status.BAD_REQUEST,
      "This booking has already been completed.",
    );
  }

  if (booking.payment?.status === "PAID") {
    throw new AppError(
      status.BAD_REQUEST,
      "This booking has already been paid.",
    );
  }

  /*
   * If a PaymentIntent already exists, return it instead
   * of creating another one.
   */
  if (booking.payment?.paymentIntentId) {
    const existingPaymentIntent = await stripe.paymentIntents.retrieve(
      booking.payment.paymentIntentId,
    );

    return {
      clientSecret: existingPaymentIntent.client_secret,
      paymentIntentId: existingPaymentIntent.id,
    };
  }

  /*
   * Stripe expects the amount in the smallest currency unit.
   *
   * Example:
   * $120.00 → 12000 cents
   */
  const amountInSmallestUnit = Number(booking.totalAmount) * 100;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amountInSmallestUnit),

    currency: process.env.STRIPE_CURRENCY || "usd",

    automatic_payment_methods: {
      enabled: true,
    },

    metadata: {
      bookingId: booking.id,
      userId,
    },

    description: `Bookora booking ${booking.bookingNumber}`,
  });

  await prisma.payment.create({
    data: {
      bookingId: booking.id,

      amount: booking.totalAmount,

      method: "STRIPE",

      status: "PENDING",

      paymentIntentId: paymentIntent.id,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
};

const createCheckoutSession = async (userId: string, bookingId: string) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      userId,
    },

    include: {
      payment: true,

      timeSlot: {
        include: {
          room: true,
        },
      },
    },
  });

  if (!booking) {
    throw new AppError(status.NOT_FOUND, "Booking not found.");
  }

  if (booking.status === "CANCELLED") {
    throw new AppError(
      status.BAD_REQUEST,
      "A cancelled booking cannot be paid for.",
    );
  }

  if (booking.status === "COMPLETED") {
    throw new AppError(
      status.BAD_REQUEST,
      "This booking has already been completed.",
    );
  }

  if (booking.payment?.status === "PAID") {
    throw new AppError(
      status.BAD_REQUEST,
      "This booking has already been paid.",
    );
  }

  /*
   * If we already have a Checkout Session,
   * don't unnecessarily create another one.
   */
  if (booking.payment?.paymentIntentId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      booking.payment.paymentIntentId,
    );

    if (paymentIntent.status === "succeeded") {
      throw new AppError(
        status.BAD_REQUEST,
        "This booking has already been paid.",
      );
    }
  }

  const amountInSmallestUnit = Math.round(Number(booking.totalAmount) * 100);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    line_items: [
      {
        price_data: {
          currency: process.env.STRIPE_CURRENCY || "usd",

          product_data: {
            name: booking.timeSlot.room.name,

            description: `Bookora booking ${booking.bookingNumber}`,
          },

          unit_amount: amountInSmallestUnit,
        },

        quantity: 1,
      },
    ],

    metadata: {
      bookingId: booking.id,
      userId,
    },

    payment_intent_data: {
      metadata: {
        bookingId: booking.id,
        userId,
      },
    },

    success_url:
      process.env.STRIPE_SUCCESS_URL || "http://localhost:3000/payment/success",

    cancel_url:
      process.env.STRIPE_CANCEL_URL ||
      "http://localhost:3000/payment/cancelled",
  });

  return {
    sessionId: session.id,
    url: session.url,
  };
};

export const paymentService = {
  createPaymentIntent,
  createCheckoutSession,
};
