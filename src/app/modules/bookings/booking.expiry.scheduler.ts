import { bookingExpiryService } from "./booking.expiry";

const startBookingExpiryScheduler = () => {
  bookingExpiryService.expirePendingBookings().catch((error) => {
    console.error("Initial booking expiry check failed:", error);
  });

  setInterval(async () => {
    try {
      await bookingExpiryService.expirePendingBookings();
    } catch (error) {
      console.error("Booking expiry scheduler failed:", error);
    }
  }, 60 * 1000);

  console.log("Booking expiry scheduler started.");
};

export default startBookingExpiryScheduler;
