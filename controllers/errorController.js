import AppError from '../utilities/appError.js';

/**
 * @breif Handle cast error, i.e error resulting from
 * passing a value of a different datatype to a variable of
 * a different datatype
 * @param {Object} err -> Error object
 * @returns AppError message
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

/**
 * @breif Handle duplicate field value error, this is a for errors
 * resulting from database field which donot support duplicate values like email and contact
 * @param {Object} err -> Error object
 * @returns AppError message
 */
const handleDuplicateFieldsDB = (err) => {
  // 1. extract the duplicate field value
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  // 2. build error message
  const message = `Duplicate field value: ${value}. Please use another value!`;
  // 3. return message
  return new AppError(message, 400);
};

/**
 * @breif Handle validation error from the database, this method handle
 * errors resulting from database fields that are required but no provided by the user
 * and also errors resulting from invalid user input fields
 * @param {Object} err -> Error object
 * @returns AppError message
 */
const handleValidationErrorDB = (err) => {
  // 1. Extract error
  const errors = Object.values(err.errors).map((el) => el.message);
  // 2. Buiild error message
  const message = `Invalid input data. ${errors.join('. ')}`;
  // 3. Return error message
  return new AppError(message, 400);
};

/**
 * @breif handle JWT token error, when the JWT token is invalid
 * @returns AppError message
 */
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

/**
 * @breif handle JWT token expires error, when the JWT token has expired
 * @returns AppError message
 */
const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

/**
 * @breif Send error messages in "development" mode (environment)
 * @param {Object} err -> Error object
 * @param {Request} req -> Request
 * @param {Response} res -> Response
 * @returns JSON error message
 */
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
};

/**
 * @breif Send error message to client in "production" mode (environment)
 * This method check if it is an operational error and sends the message to the client,
 * if the error is a programming error, then the message is log to the console and a generic error message with
 * status code "500" send to the client
 * @param {Object} err ->Error object
 * @param {Request} req -> Request
 * @param {Response} res -> Response
 * @returns JSON error message
 */
const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1. Log error
    console.error('Error 💥', err);
    // 2. Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

/**
 * @breif Default error handler function for both production and development mode
 */
export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
