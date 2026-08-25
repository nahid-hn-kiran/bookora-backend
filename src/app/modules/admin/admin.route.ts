import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AdminController } from "./admin.controller";
import {
  getUsersQueryValidationSchema,
  updateAdminZodSchema,
  updateUserZodSchema,
} from "./admin.validation";

const router = Router();

// Users
router.get(
  "/users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(getUsersQueryValidationSchema),
  AdminController.getAllUsers,
);

router.get(
  "/users/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getUserById,
);

router.patch(
  "/users/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateUserZodSchema),
  AdminController.updateUser,
);

router.delete(
  "/users/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.deleteUser,
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getAllAdmins,
);
router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getAdminById,
);
router.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN),
  validateRequest(updateAdminZodSchema),
  AdminController.updateAdmin,
);
router.delete("/:id", checkAuth(Role.SUPER_ADMIN), AdminController.deleteAdmin);

export const AdminRoutes = router;
