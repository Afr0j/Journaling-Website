class ApiError extends Error {
  constructor(statusCode=500, message="something went wrong") {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
export default ApiError;