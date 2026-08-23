import { Router } from "express";

import { roomController } from "./room.controller";
import {
  createRoomValidationSchema,
  updateRoomValidationSchema,
} from "./room.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createRoomValidationSchema),
  roomController.createRoom,
);

router.get("/", roomController.getAllRooms);

router.get("/:roomId", roomController.getRoomById);

router.patch(
  "/:roomId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateRoomValidationSchema),
  roomController.updateRoom,
);

router.delete(
  "/:roomId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  roomController.deleteRoom,
);

export const roomRoutes = router;
