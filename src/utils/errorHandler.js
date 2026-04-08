/**
 * Shared error handling for controllers.
 * Maps known error messages to appropriate HTTP status codes.
 */
function handleError(res, err) {
  const message = err.message?.toLowerCase() || "";
  if (message?.toLowerCase().includes("not found")) {
    return res.status(404).json({ error: err.message });
  }
  if (
    message.includes("required") ||
    message.includes("invalid") ||
    message.includes("update failed") ||
    message.includes("create failed") ||
    message.includes("not a") ||
    message.includes("already cancelled") ||
    message.includes("cannot update a cancelled or completed appointment") ||
    message.includes("appointment start time must be before end time") ||
    message.includes("is not active") ||
    message.includes("not available")
  ) {
    return res.status(400).json({ error: err.message });
  }

  if (message?.toLowerCase().includes("already exists")) {
    return res.status(409).json({ error: err.message });
  }
  if (err.code === "23P01") {
    return res.status(409).json({
      error:
        "Appointment overlaps with another appointment for this staff member",
    });
  }

  return res.status(500).json({ error: err.message });
}
module.exports = { handleError };
