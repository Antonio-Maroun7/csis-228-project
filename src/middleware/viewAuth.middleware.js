const { verifyToken } = require("../utils/token");

function getCookie(req, name) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());

  for (const cookie of cookies) {
    const [key, ...valueParts] = cookie.split("=");

    if (key === name) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return null;
}

function requireViewAuth(req, res, next) {
  const token = getCookie(req, "auth_token");

  if (!token) {
    return res.redirect("/views/login?message=Please login first&type=error");
  }

  try {
    req.user = verifyToken(token);
    return next();
  } catch (err) {
    return res.redirect(
      `/views/login?message=${encodeURIComponent(err.message)}&type=error`,
    );
  }
}

function requireViewRole(allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role || req.user?.user_role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).render("not-authorized", {
        title: "Not Authorized",
        user: req.user || null,
      });
    }

    return next();
  };
}

module.exports = {
  requireViewAuth,
  requireViewRole,
};
