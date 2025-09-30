class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string, stack: "") {
    super(message); //throw new error ("Something went wrong")

    this.statusCode = statusCode;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
