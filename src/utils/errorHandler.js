/**
 * Shared error handling for controllers.
 * Maps known error messages to appropriate HTTP status codes.
 */
function handleError(res, err) {
  if (err.message?.toLowerCase().includes("not found")) {
    return res.status(404).json({ error: err.message });
  }
  if (err.message?.includes("required")) {
    return res.status(400).json({ error: err.message });
  }
  if (err.message?.toLowerCase().includes("invalid")) {
    return res.status(401).json({ error: err.message });
  }
  if (err.message?.toLowerCase().includes("already exists")) {
    return res.status(409).json({ error: err.message });
  }
  return res.status(500).json({ error: err.message });
}
module.exports = { handleError };
