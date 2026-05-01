/**
 * Centralized HTTP error mapping utility for controller catch blocks.
 */
/**
 * Shared error handling for controllers.
 * Maps known error messages to appropriate HTTP status codes.
 * @param {import("express").Response} res
 * @param {Error & { code?: string }} err
 * @returns {import("express").Response}
 */
function handleError(res, err) {
  const message = err.message?.toLowerCase() || "";
  if (
    err.code === "23P01" ||
    err.code === "23505" ||
    message.includes("duplicate key")
  ) {
    return res.status(409).json({
      error:
        "Appointment overlaps with another appointment for this staff member",
    });
  }

  if (message.includes("invalid email or password")) {
    return res.status(401).json({ error: err.message });
  }

  if (
    message.includes("access denied") ||
    message.includes("forbidden") ||
    message.includes("not active")
  ) {
    return res.status(403).json({ error: err.message });
  }

  if (message.includes("not found")) {
    return res.status(404).json({ error: err.message });
  }

  if (
    message.includes("already exist") ||
    message.includes("already exists") ||
    message.includes("already cancelled") ||
    message.includes("cannot add item to") ||
    message.includes("cannot update item of") ||
    message.includes("cannot delete item of") ||
    message.includes("cannot update a cancelled or completed appointment") ||
    message.includes("not available") ||
    message.includes("overlap") ||
    message.includes("conflict")
  ) {
    return res.status(409).json({ error: err.message });
  }

  if (
    message.includes("required") ||
    message.includes("invalid") ||
    message.includes("update failed") ||
    message.includes("create failed") ||
    message.includes("not a") ||
    message.includes("appointment start time must be before end time") ||
    message.includes("start date must be before end date")
  ) {
    return res.status(400).json({ error: err.message });
  }

  return res.status(500).json({ error: err.message });
}
module.exports = { handleError };
