import { Request, Response } from "express";

import { bookingService } from "./booking.service";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

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

const getAllBookings = catchAsync(async (_req: Request, res: Response) => {
  const bookings = await bookingService.getAllBookings();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Bookings retrieved successfully.",
    data: bookings,
  });
});

const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const booking = await bookingService.cancelBooking(
    req.params.bookingId as string,
    req.user.id,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Booking cancelled successfully.",
    data: booking,
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
  getAllBookings,
  cancelBooking,
  updateBookingStatus,
};
