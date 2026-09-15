import { Router } from "express";

import { bookingController } from "./booking.controller";

import {
  createBookingValidationSchema,
  updateBookingStatusValidationSchema,
} from "./booking.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { Role } from "../../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createBookingValidationSchema),
  bookingController.createBooking,
);

router.get(
  "/my-bookings",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  bookingController.getMyBookings,
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  bookingController.getAllBookings,
);
router.get(
  "/:bookingId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  bookingController.getBookingById,
);

router.get(
  "/admin/:bookingId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  bookingController.getBookingByIdAdmin,
);

router.post(
  "/:bookingId/cancel",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  bookingController.cancelBooking,
);

router.patch(
  "/:bookingId/status",
  validateRequest(updateBookingStatusValidationSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  bookingController.updateBookingStatus,
);

export const bookingRoutes = router;
