"use strict";

function buildFeedbackState(req = {}) {
  const query = req.query || {};

  return {
    message: query.message || null,
    messageType: query.type === "error" ? "error" : "success",
  };
}

function buildRedirectPath(basePath, message, type = "success") {
  const params = new URLSearchParams({ message, type });

  if (message) params.set("message", message);
  if (type) params.set("type", type);

  return `${basePath}?${params.toString()}`;
}

function formatDate(dateValue) {
  if (!dateValue) return null;

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return String(dateValue);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

module.exports = { buildFeedbackState, buildRedirectPath };
