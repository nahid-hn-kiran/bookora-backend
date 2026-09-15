import { venueService } from "./venue.service";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
const createVenue = catchAsync(async (req, res) => {
    const result = await venueService.createVenue(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Venue created successfully.",
        data: result,
    });
});
const getVenues = catchAsync(async (req, res) => {
    const result = await venueService.getVenues(req.query);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Venues retrieved successfully.",
        meta: result.meta,
        data: result.data,
    });
});
const getVenueById = catchAsync(async (req, res) => {
    const result = await venueService.getVenueById(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Venue retrieved successfully.",
        data: result,
    });
});
const updateVenue = catchAsync(async (req, res) => {
    const result = await venueService.updateVenue(req.params.id, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Venue updated successfully.",
        data: result,
    });
});
const deleteVenue = catchAsync(async (req, res) => {
    const result = await venueService.deleteVenue(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Venue deleted successfully.",
        data: result,
    });
});
export const venueController = {
    createVenue,
    getVenues,
    getVenueById,
    updateVenue,
    deleteVenue,
};
