/**
 * Token utility for generating and verifying signed authentication tokens.
 */
const crypto = require("crypto");

const DEFAULT_TOKEN_TTL_SECONDS = 60 * 60;

/**
 * Encodes a UTF-8 value into URL-safe base64.
 * @param {string} value
 * @returns {string}
 */
function toBase64Url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

/**
 * Decodes a URL-safe base64 string into UTF-8.
 * @param {string} value
 * @returns {string}
 */
function fromBase64Url(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4;
  const padded = padding ? normalized + "=".repeat(4 - padding) : normalized;
  return Buffer.from(padded, "base64").toString("utf8");
}

/**
 * Resolves the signing secret from environment variables.
 * @returns {string}
 */
function getSecret() {
  return process.env.AUTH_SECRET || "dev-secret-change-me";
}

/**
 * Resolves token lifetime in seconds.
 * @returns {number}
 */
function getExpiresInSeconds() {
  const parsed = Number(process.env.AUTH_TOKEN_TTL_SECONDS);
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : DEFAULT_TOKEN_TTL_SECONDS;
}

/**
 * Builds an HMAC signature for an encoded payload string.
 * @param {string} value
 * @returns {string}
 */
function sign(value) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(value)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

/**
 * Creates a signed token containing payload data plus expiration.
 * @param {Object} payload
 * @returns {string}
 */
function generateToken(payload) {
  const expiresAt = Math.floor(Date.now() / 1000) + getExpiresInSeconds();
  const encodedPayload = toBase64Url(
    JSON.stringify({ ...payload, exp: expiresAt }),
  );
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

/**
 * Validates a signed token and returns the decoded payload.
 * @param {string} token
 * @returns {Object}
 * @throws {Error} When token structure, signature, or expiration is invalid.
 */
function verifyToken(token) {
  if (!token || !token.includes(".")) {
    throw new Error("Invalid token");
  }

  const [encodedPayload, signature] = token.split(".");
  const expectedSignature = sign(encodedPayload);

  if (signature !== expectedSignature) {
    throw new Error("Invalid token");
  }

  const payload = JSON.parse(fromBase64Url(encodedPayload));

  if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("Token expired");
  }

  return payload;
}

module.exports = {
  generateToken,
  verifyToken,
};
