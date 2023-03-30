/**
 * @breif Class to handle Applications errors,
 * @details Set error message and status code
 */
export default class AppError extends Error {
  /**
   * @brief Constructor for app error
   * @param {String} message -> Error message
   * @param {Number} statusCode -> Error code
   */
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
