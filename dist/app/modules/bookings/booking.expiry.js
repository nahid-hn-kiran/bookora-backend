import { prisma } from "../../../lib/prisma";
import { stripe } from "../../config/stripe";
const expirePendingBookings = async () => {
    const now = new Date();
    const expiredBookings = await prisma.booking.findMany({
        where: {
            status: "PENDING",
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
            if (booking.payment?.paymentIntentId) {
                try {
                    const paymentIntent = await stripe.paymentIntents.retrieve(booking.payment.paymentIntentId);
                    if (paymentIntent.status === "requires_payment_method" ||
                        paymentIntent.status === "requires_confirmation" ||
                        paymentIntent.status === "requires_action") {
                        await stripe.paymentIntents.cancel(paymentIntent.id);
                    }
                }
                catch (error) {
                    console.error(`Failed to cancel PaymentIntent for booking ${booking.id}:`, error);
                }
            }
            if (booking.payment?.checkoutSessionId) {
                try {
                    const session = await stripe.checkout.sessions.retrieve(booking.payment.checkoutSessionId);
                    if (session.status === "open") {
                        await stripe.checkout.sessions.expire(session.id);
                    }
                }
                catch (error) {
                    console.error(`Failed to expire Checkout Session for booking ${booking.id}:`, error);
                }
            }
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
        }
        catch (error) {
            console.error(`Failed to expire booking ${booking.bookingNumber}:`, error);
        }
    }
};
export const bookingExpiryService = {
    expirePendingBookings,
};
