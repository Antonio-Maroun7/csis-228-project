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
  if (err.message?.toLowerCase().includes("update failed")) {
    return res.status(400).json({ error: err.message });
  }
  if (err.message?.toLowerCase().includes("not a")) {
    return res.status(400).json({ error: err.message });
  }
  if (err.message?.toLowerCase().includes("Invalid")) {
    return res.status(400).json({ error: err.message });
  }
  if (err.message?.toLowerCase().includes("already cancelled")) {
    return res.status(400).json({ error: err.message });
  }
  if (err.message?.toLowerCase().includes("is not active")) {
    return res.status(400).json({ error: err.message });
  }
  if (err.message === "Cannot update a cancelled or completed appointment") {
    return res.status(400).json({ error: err.message });
  }
  if (
    err.message
      ?.toLowerCase()
      .includes("appointment start time must be before end time")
  ) {
    return res.status(400).json({ error: err.message });
  }
  if (err.message?.toLowerCase().includes("already exists")) {
    return res.status(409).json({ error: err.message });
  }
  return res.status(500).json({ error: err.message });
}
module.exports = { handleError };
