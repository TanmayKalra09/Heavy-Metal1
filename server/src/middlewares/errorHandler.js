const errorHandler = (err, req, res, next) => {
    // If a status code has already been set in a controller, use it. Otherwise, default to 500 (Internal Server Error).
    const statusCode = res.statusCode ? res.statusCode : 500;

    res.status(statusCode);

    // Send a structured JSON error response
    res.json({
        message: err.message,
        // Include the stack trace for debugging purposes, but only in development mode.
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export { errorHandler };