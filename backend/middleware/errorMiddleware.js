// 404 Not Found Middleware
const notFound = (req, res, next) => {
  const error = new Error(`Resource not found on ApexDrive API - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found with the requested ID format';
  }

  // Handle Prisma Unique Constraint Violation (P2002)
  if (err.code === 'P2002') {
    statusCode = 400;
    const target = err.meta && err.meta.target ? err.meta.target : 'field';
    message = `An account with this ${target} already exists. Please sign in or use another ${target}.`;
  }

  // Handle Mongoose Duplicate Key Error (e.g. unique email)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `An account with that ${field} already exists. Please sign in or use another ${field}.`;
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
  }

  // Handle JsonWebTokenError
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token. Please sign in again.';
  }

  // Handle TokenExpiredError
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session token has expired. Please sign in again.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
