const { error } = require('../utils/responseFormat');

// Catches anything thrown/rejected inside a controller and returns it
// in the Standard Error Shape instead of crashing the server or leaking a stack trace.
function errorHandler(err, req, res, next) {
  console.error(err);
  return error(res, err.message || 'Something went wrong on the server', err.statusCode || 500);
}

module.exports = errorHandler;
