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

  if (booking.status === "CONFIRMED") {
    throw new AppError(
      status.BAD_REQUEST,
      "This booking has already been confirmed.",
    );
  }

  if (booking.expiresAt && booking.expiresAt <= new Date()) {
    throw new AppError(
      status.BAD_REQUEST,
      "This booking has expired. Please create a new booking.",
    );
  }

  if (booking.payment?.status === "PAID") {
    throw new AppError(
      status.BAD_REQUEST,
      "This booking has already been paid.",
    );
  }

  /*
   * If a PaymentIntent already exists,
   * check its current Stripe status before deciding
   * whether we can reuse it.
   */
  if (booking.payment?.paymentIntentId) {
    const existingPaymentIntent = await stripe.paymentIntents.retrieve(
      booking.payment.paymentIntentId,
    );

    /*
     * Payment already succeeded on Stripe.
     *
     * The webhook may still be processing, so don't
     * create another PaymentIntent.
     */
    if (existingPaymentIntent.status === "succeeded") {
      throw new AppError(
        status.BAD_REQUEST,
        "This payment has already been completed.",
      );
    }

    /*
     * These PaymentIntent states can still be used
     * to complete the payment.
     */
    if (
      existingPaymentIntent.status === "requires_payment_method" ||
      existingPaymentIntent.status === "requires_confirmation" ||
      existingPaymentIntent.status === "requires_action"
    ) {
      return {
        clientSecret: existingPaymentIntent.client_secret,
        paymentIntentId: existingPaymentIntent.id,
      };
    }

    /*
     * If Stripe has cancelled the old PaymentIntent,
     * we'll create a new one below.
     */
  }

  const amountInSmallestUnit = Math.round(Number(booking.totalAmount) * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInSmallestUnit,

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

  /*
   * If a Payment record already exists, update it
   * with the new PaymentIntent.
   *
   * Otherwise create a new Payment record.
   */
  if (booking.payment) {
    await prisma.payment.update({
      where: {
        id: booking.payment.id,
      },

      data: {
        paymentIntentId: paymentIntent.id,
        status: "PENDING",
      },
    });
  } else {
    await prisma.payment.create({
      data: {
        bookingId: booking.id,

        amount: booking.totalAmount,

        method: "STRIPE",

        status: "PENDING",

        paymentIntentId: paymentIntent.id,
      },
    });
  }

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

  if (booking.status === "CONFIRMED") {
    throw new AppError(
      status.BAD_REQUEST,
      "This booking has already been confirmed.",
    );
  }

  if (booking.expiresAt && booking.expiresAt <= new Date()) {
    throw new AppError(
      status.BAD_REQUEST,
      "This booking has expired. Please create a new booking.",
    );
  }

  if (booking.payment?.status === "PAID") {
    throw new AppError(
      status.BAD_REQUEST,
      "This booking has already been paid.",
    );
  }

  /*
   * If there is an existing Checkout Session,
   * check whether it is still usable.
   */
  if (booking.payment?.checkoutSessionId) {
    const existingSession = await stripe.checkout.sessions.retrieve(
      booking.payment.checkoutSessionId,
    );

    /*
     * User already has an active checkout page.
     */
    if (existingSession.status === "open") {
      return {
        sessionId: existingSession.id,
        url: existingSession.url,
      };
    }

    /*
     * Checkout was completed.
     */
    if (existingSession.status === "complete") {
      throw new AppError(
        status.BAD_REQUEST,
        "This booking payment has already been completed.",
      );
    }

    /*
     * If the session has expired, we simply create
     * a new Checkout Session below.
     */
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

  /*
   * Update the existing Payment record or create one.
   */
  if (booking.payment) {
    await prisma.payment.update({
      where: {
        id: booking.payment.id,
      },

      data: {
        checkoutSessionId: session.id,

        /*
         * A new checkout attempt is pending.
         */
        status: "PENDING",
      },
    });
  } else {
    await prisma.payment.create({
      data: {
        bookingId: booking.id,

        amount: booking.totalAmount,

        method: "STRIPE",

        status: "PENDING",

        checkoutSessionId: session.id,
      },
    });
  }

  return {
    sessionId: session.id,
    url: session.url,
  };
};

export const paymentService = {
  createPaymentIntent,
  createCheckoutSession,
};
