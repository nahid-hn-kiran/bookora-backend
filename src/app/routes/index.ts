import { Request, Response, Router } from "express";
import status from "http-status";
import AppError from "../errorHelpers/appError";
import catchAsync from "../shared/catchAsync";
import { bookingExpiryService } from "../modules/bookings/booking.expiry";
import { authRoutes } from "../modules/auth/auth.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { venueRoutes } from "../modules/venues/venue.route";
import { roomRoutes } from "../modules/rooms/room.route";
import { timeSlotRoutes } from "../modules/time-slots/timeSlot.route";
import { bookingRoutes } from "../modules/bookings/booking.route";
import { paymentRoutes } from "../modules/payment/payment.route";
import { AdminDashboardRoutes } from "../modules/dashboard/admin.dashboard.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admins", AdminRoutes);
router.use("/venues", venueRoutes);
router.use("/rooms", roomRoutes);
router.use("/time-slots", timeSlotRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);
router.use("/admin/dashboard", AdminDashboardRoutes);

/*
 * Replaces the in-process expiry scheduler on serverless hosts.
 * Accepts the secret as `?secret=` or as `Authorization: Bearer`,
 * which is what Vercel Cron sends.
 */
router.get(
  "/cron/expire-bookings",
  catchAsync(async (req: Request, res: Response) => {
    const cronSecret = process.env.CRON_SECRET;

    const isAuthorized =
      !!cronSecret &&
      (req.query.secret === cronSecret ||
        req.headers.authorization === `Bearer ${cronSecret}`);

    if (!isAuthorized) {
      throw new AppError(status.UNAUTHORIZED, "Unauthorized access!");
    }

    await bookingExpiryService.expirePendingBookings();

    res.status(status.OK).json({
      success: true,
      processedAt: new Date(),
    });
  }),
);

export const indexRoutes = router;
