import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AdminDashboardService } from "./admin.dashboard.service";
const getDashboardStats = catchAsync(async (_req, res) => {
    const result = await AdminDashboardService.getDashboardStats();
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Dashboard statistics fetched successfully",
        data: result,
    });
});
export const AdminDashboardController = {
    getDashboardStats,
};
