/**
 * Middleware for protecting EJS view pages using JWT stored in a cookie.
 * This is separate from the API authenticate middleware because browser forms
 * do not automatically send Authorization headers.
 */
const { verifyToken } = require("../utils/token");

/**
 * Reads one cookie value from the request header.
 * @param {import("express").Request} req
 * @param {string} name
 * @returns {string|null}
 */
function getCookie(req, name) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());

  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

/**
 * This function is a middleware used to protect frontend EJS pages.
 * It checks if the user is logged in before allowing them to open a page.
 */
function requireViewAuth(req, res, next) {
  const token = getCookie(req, "token");
  if (!token) {
    return res.redirect("/views/login?message=Please login first&type=error");
  }
  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    return res.redirect(
      `/views/login?message=${encodeURIComponent(err.message)}&type=error`,
    );
  }
}

/**
 * Protects pages based on role.
 * Example:
 * requireViewRole(["admin"])
 */
function requireViewRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).render("not-authorized", {
        title: "Not Authorized",
        user: req.user || null,
      });
    }
    next();
  };
}

module.exports = {
  requireViewAuth,
  requireViewRole,
};
