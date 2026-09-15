import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { AdminDashboardController } from "./admin.dashboard.controller";
const router = Router();
router.get("/stats", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), AdminDashboardController.getDashboardStats);
export const AdminDashboardRoutes = router;
