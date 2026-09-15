import { timeSlotService } from "./timeSlot.service";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
const createTimeSlot = catchAsync(async (req, res) => {
    const timeSlot = await timeSlotService.createTimeSlot(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Time slot created successfully.",
        data: timeSlot,
    });
});
const getAllTimeSlots = catchAsync(async (req, res) => {
    const timeSlots = await timeSlotService.getAllTimeSlots({
        roomId: req.query.roomId,
        date: req.query.date,
    });
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Time slots retrieved successfully.",
        data: timeSlots,
    });
});
const getTimeSlotById = catchAsync(async (req, res) => {
    const timeSlot = await timeSlotService.getTimeSlotById(req.params.timeSlotId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Time slot retrieved successfully.",
        data: timeSlot,
    });
});
const updateTimeSlot = catchAsync(async (req, res) => {
    const timeSlot = await timeSlotService.updateTimeSlot(req.params.timeSlotId, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Time slot updated successfully.",
        data: timeSlot,
    });
});
const deleteTimeSlot = catchAsync(async (req, res) => {
    await timeSlotService.deleteTimeSlot(req.params.timeSlotId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Time slot deleted successfully.",
    });
});
export const timeSlotController = {
    createTimeSlot,
    getAllTimeSlots,
    getTimeSlotById,
    updateTimeSlot,
    deleteTimeSlot,
};
