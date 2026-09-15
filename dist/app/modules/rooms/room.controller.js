import { roomService } from "./room.service";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
const createRoom = catchAsync(async (req, res) => {
    const room = await roomService.createRoom(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Room created successfully.",
        data: room,
    });
});
const getAllRooms = catchAsync(async (req, res) => {
    const rooms = await roomService.getAllRooms({
        venueId: req.query.venueId,
        status: req.query.status,
    });
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Rooms retrieved successfully.",
        data: rooms,
    });
});
const getRoomById = catchAsync(async (req, res) => {
    const room = await roomService.getRoomById(req.params.roomId);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Room retrieved successfully.",
        data: room,
    });
});
const updateRoom = catchAsync(async (req, res) => {
    const room = await roomService.updateRoom(req.params.roomId, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Room updated successfully.",
        data: room,
    });
});
const deleteRoom = catchAsync(async (req, res) => {
    const room = await roomService.deleteRoom(req.params.roomId);
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
