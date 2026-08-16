// 404 Handler for unknown routes
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
}

// Centralized error handler
function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message: message
    // Note: Stack traces are intentionally not exposed to the client
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
