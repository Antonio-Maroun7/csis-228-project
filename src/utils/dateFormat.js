/**
 * Centralized date/time formatting helpers for user-facing API responses.
 */
const moment = require("moment");

const DATE_FORMAT = "DD-MM-YYYY";
const DATETIME_FORMAT = "DD-MM-YYYY HH:mm";
const TIME_FORMAT = "HH:mm";

/**
 * Formats a date-like value using a specific format, returning null for invalid values.
 * @param {string|number|Date|null|undefined} value
 * @param {string} format
 * @returns {string|null}
 */
const formatValue = (value, format) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = moment(value);
  if (!parsed.isValid()) {
    return null;
  }

  return parsed.format(format);
};

/**
 * Formats a value as date-only (DD-MM-YYYY).
 * @param {string|number|Date|null|undefined} value
 * @returns {string|null}
 */
const formatDate = (value) => formatValue(value, DATE_FORMAT);

/**
 * Formats a value as datetime (DD-MM-YYYY HH:mm).
 * @param {string|number|Date|null|undefined} value
 * @returns {string|null}
 */
const formatDateTime = (value) => formatValue(value, DATETIME_FORMAT);

/**
 * Formats a value as time-only (HH:mm).
 * @param {string|number|Date|null|undefined} value
 * @returns {string|null}
 */
const formatTime = (value) => formatValue(value, TIME_FORMAT);

module.exports = {
  DATE_FORMAT,
  DATETIME_FORMAT,
  TIME_FORMAT,
  formatDate,
  formatDateTime,
  formatTime,
};
