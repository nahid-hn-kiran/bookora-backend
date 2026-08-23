import { Request, Response } from "express";

import { timeSlotService } from "./timeSlot.service";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const createTimeSlot = catchAsync(async (req: Request, res: Response) => {
  const timeSlot = await timeSlotService.createTimeSlot(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Time slot created successfully.",
    data: timeSlot,
  });
});

const getAllTimeSlots = catchAsync(async (req: Request, res: Response) => {
  const timeSlots = await timeSlotService.getAllTimeSlots({
    roomId: req.query.roomId as string | undefined,
    date: req.query.date as string | undefined,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Time slots retrieved successfully.",
    data: timeSlots,
  });
});

const getTimeSlotById = catchAsync(async (req: Request, res: Response) => {
  const timeSlot = await timeSlotService.getTimeSlotById(
    req.params.timeSlotId as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Time slot retrieved successfully.",
    data: timeSlot,
  });
});

const updateTimeSlot = catchAsync(async (req: Request, res: Response) => {
  const timeSlot = await timeSlotService.updateTimeSlot(
    req.params.timeSlotId as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Time slot updated successfully.",
    data: timeSlot,
  });
});

const deleteTimeSlot = catchAsync(async (req: Request, res: Response) => {
  await timeSlotService.deleteTimeSlot(req.params.timeSlotId as string);

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
