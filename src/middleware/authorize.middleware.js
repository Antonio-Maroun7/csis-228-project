/**
 * Access control middleware to permit specific user roles.
 * Must be used after the `authenticate` middleware.
 *
 * @param {string[]} [allowedRoles=[]] - An array of user types that are permitted to access the route.
 * @returns {import('express').RequestHandler} Express middleware function checking user roles.
 */
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userRole = req.user.role;
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: `Access denied. Required role(s): ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};

module.exports = authorize;
