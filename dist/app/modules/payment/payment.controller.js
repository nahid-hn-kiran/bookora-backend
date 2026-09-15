import { paymentService } from "./payment.service";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
const createPaymentIntent = catchAsync(async (req, res) => {
    const result = await paymentService.createPaymentIntent(req.user.id, req.body.bookingId);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Payment intent created successfully.",
        data: result,
    });
});
const createCheckoutSession = catchAsync(async (req, res) => {
    const result = await paymentService.createCheckoutSession(req.user.id, req.body.bookingId);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Checkout session created successfully.",
        data: result,
    });
});
export const paymentController = {
    createPaymentIntent,
    createCheckoutSession,
};
