import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { venueController } from "./venue.controller";
import { venueValidation } from "./vanue.validation";
import { Role } from "../../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(venueValidation.createVenueValidationSchema),
  venueController.createVenue,
);

router.get("/", venueController.getVenues);

router.get("/:id", venueController.getVenueById);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(venueValidation.updateVenueValidationSchema),
  venueController.updateVenue,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  venueController.deleteVenue,
);

export const venueRoutes = router;
