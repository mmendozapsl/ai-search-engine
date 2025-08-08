// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Default error
  let error = {
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error'
  };

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.statusCode = 400;
    error.message = 'Resource not found';
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error.statusCode = 400;
    error.message = 'Duplicate field value entered';
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error.statusCode = 400;
    error.message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // MySQL errors
  if (err.code === 'ER_DUP_ENTRY') {
    error.statusCode = 400;
    error.message = 'Duplicate entry - resource already exists';
  }

  if (err.code === 'ER_NO_SUCH_TABLE') {
    error.statusCode = 500;
    error.message = 'Database table not found';
  }

  res.status(error.statusCode).json({
    success: false,
    error: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  notFound,
  asyncHandler
};