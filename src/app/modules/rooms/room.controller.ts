import { Request, Response } from "express";

import { roomService } from "./room.service";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const createRoom = catchAsync(async (req: Request, res: Response) => {
  const room = await roomService.createRoom(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Room created successfully.",
    data: room,
  });
});

const getAllRooms = catchAsync(async (req: Request, res: Response) => {
  const rooms = await roomService.getAllRooms({
    venueId: req.query.venueId as string | undefined,
    status: req.query.status as string | undefined,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Rooms retrieved successfully.",
    data: rooms,
  });
});

const getRoomById = catchAsync(async (req: Request, res: Response) => {
  const room = await roomService.getRoomById(req.params.roomId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Room retrieved successfully.",
    data: room,
  });
});

const updateRoom = catchAsync(async (req: Request, res: Response) => {
  const room = await roomService.updateRoom(
    req.params.roomId as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Room updated successfully.",
    data: room,
  });
});

const deleteRoom = catchAsync(async (req: Request, res: Response) => {
  const room = await roomService.deleteRoom(req.params.roomId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Room deleted successfully.",
    data: room,
  });
});

export const roomController = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
};
