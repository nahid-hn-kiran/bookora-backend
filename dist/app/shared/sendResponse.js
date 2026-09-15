export const sendResponse = (res, responseData) => {
    const { statusCode, success, message, data, meta } = responseData;
    res.status(statusCode).json({
        success,
        message,
        ...(meta && { meta }),
        ...(data !== undefined && { data }),
    });
};
