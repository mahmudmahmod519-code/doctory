const ApiError = require('../utils/ApiError');

const handleJwtInvalid = () =>
  new ApiError('Invalid token, please login again', 401);

const handleJwtExpired = () =>
  new ApiError('Token has expired, please login again', 401);

const handleDuplicateKey = (err) => {
  const fields = Object.keys(err.keyValue || err.keyPattern || {});
  const field = fields.length ? fields.join(', ') : 'field';
  return new ApiError(`Duplicate value for ${field}. Please use another value`, 409);
};

const handleMongooseValidation = (err) => {
  const messages = Object.values(err.errors).map((e) => e.message);
  return new ApiError(`Invalid input data: ${messages.join(', ')}`, 400);
};

const handleCastError = (err) =>
  new ApiError(`Invalid ${err.path}: ${err.value}`, 400);

const handleBadJson = () => new ApiError('Invalid JSON in request body', 400);

const globalError = (err, req, res, next) => {
  let error = err;

  if (err.name === 'JsonWebTokenError') error = handleJwtInvalid();
  else if (err.name === 'TokenExpiredError') error = handleJwtExpired();
  else if (err.code === 11000) error = handleDuplicateKey(err);
  else if (err.name === 'ValidationError' && err.errors) error = handleMongooseValidation(err);
  else if (err.name === 'CastError') error = handleCastError(err);
  else if (err.type === 'entity.parse.failed') error = handleBadJson();

  const statusCode = error.statusCode || 500;
  const status = error.status || 'error';
  const isProduction = process.env.NODE_ENV === 'production';

  if (!error.isOperational) {
    console.error('UNEXPECTED ERROR:', err);
  }

  if (isProduction) {
    return res.status(statusCode).json({
      status,
      message: error.isOperational ? error.message : 'Something went wrong'
    });
  }

  return res.status(statusCode).json({
    status,
    message: error.message,
    stack: err.stack
  });
};

module.exports = globalError;
