export function errorHandler(err, req, res, next) {
  console.error("[Unhandled Server Error]", err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "An unexpected server error occurred. Please try again.",
    code: err.code || "INTERNAL_ERROR"
  });
}
