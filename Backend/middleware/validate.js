const { error } = require('../utils/responseFormat');

// Simple reusable validator: pass an array of required field names,
// it checks req.body has all of them and returns a clear error if not.
// This is the one pattern every endpoint reuses — see API_CONTRACT.md Part A, Step 10.
function requireFields(fields) {
  return (req, res, next) => {
    for (const field of fields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        return error(res, `"${field}" is required`, 400, field);
      }
    }
    next();
  };
}

module.exports = { requireFields };
