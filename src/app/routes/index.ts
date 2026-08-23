import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { venueRoutes } from "../modules/venues/venue.route";
import { roomRoutes } from "../modules/rooms/room.route";
import { timeSlotRoutes } from "../modules/time-slots/timeSlot.route";
import { bookingRoutes } from "../modules/bookings/booking.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admins", AdminRoutes);
router.use("/venues", venueRoutes);
router.use("/rooms", roomRoutes);
router.use("/time-slots", timeSlotRoutes);
router.use("/bookings", bookingRoutes);

export const indexRoutes = router;
