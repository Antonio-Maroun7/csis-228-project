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

/**
 * Allows access when requester owns the resource id in route params,
 * or when requester has one of the bypass roles.
 *
 * @param {string[]} [bypassRoles=[]]
 * @param {string} [idParam="id"]
 * @returns {import("express").RequestHandler}
 */
authorize.selfByIdOrRoles = (bypassRoles = [], idParam = "id") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userRole = req.user.role;
    if (bypassRoles.includes(userRole)) {
      return next();
    }

    const currentUserId = Number(req.user.id);
    const targetUserId = Number(req.params[idParam]);
    if (Number.isFinite(currentUserId) && currentUserId === targetUserId) {
      return next();
    }

    return res.status(403).json({ error: "Access denied" });
  };
};

/**
 * Allows access when requester owns the email in route params,
 * or when requester has one of the bypass roles.
 *
 * @param {string[]} [bypassRoles=[]]
 * @param {string} [emailParam="user_email"]
 * @returns {import("express").RequestHandler}
 */
authorize.selfByEmailOrRoles = (
  bypassRoles = [],
  emailParam = "user_email",
) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userRole = req.user.role;
    if (bypassRoles.includes(userRole)) {
      return next();
    }

    const currentUserEmail = String(req.user.email || "").toLowerCase();
    const targetEmail = String(req.params[emailParam] || "").toLowerCase();
    if (currentUserEmail && currentUserEmail === targetEmail) {
      return next();
    }

    return res.status(403).json({ error: "Access denied" });
  };
};

module.exports = authorize;
