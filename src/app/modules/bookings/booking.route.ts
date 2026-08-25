import { Router } from "express";

import { bookingController } from "./booking.controller";

import {
  createBookingValidationSchema,
  updateBookingStatusValidationSchema,
} from "./booking.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  checkAuth(Role.USER),
  validateRequest(createBookingValidationSchema),
  bookingController.createBooking,
);

router.get(
  "/my-bookings",
  checkAuth(Role.USER),
  bookingController.getMyBookings,
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  bookingController.getAllBookings,
);

router.get(
  "/:bookingId",
  checkAuth(Role.USER),
  bookingController.getBookingById,
);

router.get(
  "/admin/:bookingId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  bookingController.getBookingByIdAdmin,
);

router.post(
  "/:bookingId/cancel",
  checkAuth(Role.USER),
  bookingController.cancelBooking,
);

router.patch(
  "/:bookingId/status",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateBookingStatusValidationSchema),
  bookingController.updateBookingStatus,
);

export const bookingRoutes = router;
