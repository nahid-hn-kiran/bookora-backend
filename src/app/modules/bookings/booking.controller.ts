import { Request, Response } from "express";

import { bookingService } from "./booking.service";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingService.createBooking(req.user.id, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Booking created successfully.",
    data: booking,
  });
});

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
  const bookings = await bookingService.getMyBookings(req.user.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Bookings retrieved successfully.",
    data: bookings,
  });
});

const getBookingById = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingService.getBookingById(
    req.params.bookingId as string,
    req.user.id,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking retrieved successfully.",
    data: booking,
  });
});

const getBookingByIdAdmin = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingService.getBookingByIdAdmin(
    req.params.bookingId as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking retrieved successfully.",
    data: booking,
  });
});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingService.getAllBookings(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Bookings retrieved successfully.",
    data: result.data,
    meta: result.meta,
  });
});

const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await bookingService.cancelBooking(
    req.user.id,
    req.params.bookingId as string,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Booking cancelled successfully.",
    data: result,
  });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingService.updateBookingStatus(
    req.params.bookingId as string,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking status updated successfully.",
    data: booking,
  });
});

export const bookingController = {
  createBooking,
  getMyBookings,
  getBookingById,
  getBookingByIdAdmin,
  getAllBookings,
  cancelBooking,
  updateBookingStatus,
};
