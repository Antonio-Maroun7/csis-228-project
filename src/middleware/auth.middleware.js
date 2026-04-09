/**
 * Authentication middleware that validates bearer tokens and attaches payload data to the request.
 */
const { verifyToken } = require("../utils/token");

/**
 * Verifies the Authorization bearer token and populates req.user.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {void}
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};
module.exports = { authenticate };
