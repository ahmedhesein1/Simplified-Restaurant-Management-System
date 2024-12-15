const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: "failed",
    statusCode: err.statusCode,
    message: err.message,
    stack: err.stack,
  });
};
export default globalErrorHandler;
