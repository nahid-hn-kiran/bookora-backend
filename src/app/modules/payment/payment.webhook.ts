import { Request, Response } from "express";
import Stripe from "stripe";

import { prisma } from "../../../lib/prisma";
import { stripe } from "../../config/stripe";
import { envVars } from "../../config/env";

const handleStripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      envVars.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);

    return res.status(400).json({
      success: false,
      message: "Invalid Stripe webhook signature.",
    });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      await handlePaymentSucceeded(paymentIntent);

      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      await handlePaymentFailed(paymentIntent);

      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;

      await handleChargeRefunded(charge);

      break;
    }

    default:
      console.log(`Unhandled Stripe event: ${event.type}`);
  }

  return res.status(200).json({
    received: true,
  });
};

const handlePaymentSucceeded = async (paymentIntent: Stripe.PaymentIntent) => {
  const bookingId = paymentIntent.metadata.bookingId;

  if (!bookingId) {
    console.error("Booking ID missing from PaymentIntent metadata.");

    return;
  }

  await prisma.$transaction(async (transaction) => {
    const booking = await transaction.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!booking) {
      console.error("Booking not found:", bookingId);

      return;
    }

    const existingPayment = await transaction.payment.findUnique({
      where: {
        paymentIntentId: paymentIntent.id,
      },
    });

    if (existingPayment) {
      if (existingPayment.status === "PAID") {
        return;
      }

      await transaction.payment.update({
        where: {
          id: existingPayment.id,
        },

        data: {
          status: "PAID",
          paidAt: new Date(),
          paymentIntentId: paymentIntent.id,
        },
      });
    } else {
      await transaction.payment.create({
        data: {
          bookingId: booking.id,

          amount: booking.totalAmount,

          method: "STRIPE",

          status: "PAID",

          paymentIntentId: paymentIntent.id,

          paidAt: new Date(),
        },
      });
    }

    if (booking.status !== "CONFIRMED") {
      await transaction.booking.update({
        where: {
          id: booking.id,
        },

        data: {
          status: "CONFIRMED",
        },
      });
    }
  });
};

const handlePaymentFailed = async (paymentIntent: Stripe.PaymentIntent) => {
  const payment = await prisma.payment.findUnique({
    where: {
      paymentIntentId: paymentIntent.id,
    },
  });

  if (!payment) {
    return;
  }

  await prisma.payment.update({
    where: {
      id: payment.id,
    },

    data: {
      status: "FAILED",
    },
  });
};

const handleChargeRefunded = async (charge: Stripe.Charge) => {
  if (!charge.payment_intent) {
    console.error("PaymentIntent missing from refunded charge.");

    return;
  }

  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent.id;

  await prisma.$transaction(async (transaction) => {
    const payment = await transaction.payment.findUnique({
      where: {
        paymentIntentId,
      },
      include: {
        booking: true,
      },
    });

    if (!payment) {
      console.error(
        "Payment not found for refunded PaymentIntent:",
        paymentIntentId,
      );

      return;
    }

    if (payment.status === "REFUNDED") {
      return;
    }

    await transaction.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: "REFUNDED",
      },
    });

    if (payment.booking.status !== "CANCELLED") {
      await transaction.booking.update({
        where: {
          id: payment.bookingId,
        },
        data: {
          status: "CANCELLED",
        },
      });
    }
  });
};

export const paymentWebhookController = {
  handleStripeWebhook,
};
