export default class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Call built in Error Constructor
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // To imply the error is thrown with this class by the programer deliberately
    // so it is not a code bug

    Error.captureStackTrace(this, this.constructor); // Generate a stack trace for this error object with property .stack,
    // but don’t exclude constructor function of this class from the stack trace
  }
}
