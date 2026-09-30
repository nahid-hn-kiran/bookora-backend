import { stripe } from "../../config/stripe";

interface IStripePaymentReference {
  paymentIntentId: string | null;
  checkoutSessionId: string | null;
}

/*
 * Cancels the unpaid PaymentIntent and expires the open Checkout Session
 * of a booking that is being cancelled or expired, so the customer can
 * no longer pay for it.
 */
const releaseStripePayment = async (
  bookingId: string,
  payment: IStripePaymentReference | null,
) => {
  if (payment?.paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        payment.paymentIntentId,
      );

      if (
        paymentIntent.status === "requires_payment_method" ||
        paymentIntent.status === "requires_confirmation" ||
        paymentIntent.status === "requires_action"
      ) {
        await stripe.paymentIntents.cancel(paymentIntent.id);
      }
    } catch (error) {
      console.error(
        `Failed to cancel PaymentIntent for booking ${bookingId}:`,
        error,
      );
    }
  }

  if (payment?.checkoutSessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(
        payment.checkoutSessionId,
      );

      if (session.status === "open") {
        await stripe.checkout.sessions.expire(session.id);
      }
    } catch (error) {
      console.error(
        `Failed to expire Checkout Session for booking ${bookingId}:`,
        error,
      );
    }
  }
};

/*
 * A refund that is still "pending" has been accepted by Stripe and will
 * settle later, so only "failed" and "canceled" count as a failed refund.
 */
const isRefundFailed = (refundStatus: string | null) => {
  return refundStatus === "failed" || refundStatus === "canceled";
};

export const paymentUtils = {
  releaseStripePayment,
  isRefundFailed,
};
