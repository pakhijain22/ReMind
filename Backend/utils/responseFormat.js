// Standard Success/Error shape, per API_CONTRACT.md — every route uses these two helpers
// so the response shape is identical across the whole API, matching what Frontend expects.

function success(res, data, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data });
}

function error(res, message, statusCode = 400, field = null) {
  return res.status(statusCode).json({ success: false, error: { message, field } });
}

module.exports = { success, error };
