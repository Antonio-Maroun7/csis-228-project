"use strict";

const UserService = require("../../services/user.service");
const { buildRedirectPath } = require("./feedback.util");

function getUserRole(user) {
  return user?.role || user?.user_role || "client";
}

function redirectByRole(res, user, message = "Login successful") {
  const role = getUserRole(user);

  if (role === "admin") {
    return res.redirect(buildRedirectPath("/views/admin-dashboard", message));
  }

  if (role === "staff") {
    return res.redirect(buildRedirectPath("/views/staff-dashboard", message));
  }

  return res.redirect(buildRedirectPath("/views/client-home", message));
}

function capitalizeName(value) {
  if (!value) return "Client";

  const text = String(value).trim();

  if (!text) return "Client";

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function extractFirstName(value) {
  if (!value) return "Client";

  let text = String(value).trim();

  if (!text) return "Client";

  if (text.includes("@")) {
    text = text.split("@")[0];
  }

  text = text
    .replace(/[0-9]/g, "")
    .replace(/[._-]+/g, " ")
    .trim();

  const parts = text.split(/\s+/).filter(Boolean);

  if (parts.length > 1) {
    return capitalizeName(parts[0]);
  }

  let singleValue = parts[0] || text;
  const lowerValue = singleValue.toLowerCase();

  const knownFirstNames = [
    "antonio",
    "john",
    "jane",
    "maria",
    "marie",
    "mohammad",
    "mohammed",
    "ahmad",
    "ali",
    "hassan",
    "hussein",
    "george",
    "elie",
    "joe",
    "charbel",
    "mike",
    "sarah",
    "priya",
    "samir",
    "maroun",
    "gaby",
  ];

  const matchedName = knownFirstNames.find((name) =>
    lowerValue.startsWith(name),
  );

  if (matchedName) {
    singleValue = matchedName;
  }

  return capitalizeName(singleValue);
}

function getFirstName(user) {
  const userFullName =
    user?.user_fullname ||
    user?.full_name ||
    user?.fullname ||
    user?.name ||
    user?.user_name ||
    user?.user_email ||
    user?.email ||
    "Client";

  return extractFirstName(userFullName);
}

async function getLoggedInUser(req) {
  const tokenUser = req.user || null;

  if (!tokenUser?.id) {
    return tokenUser;
  }

  try {
    return await UserService.getUserById(tokenUser.id);
  } catch (err) {
    return tokenUser;
  }
}

module.exports = { getUserRole, redirectByRole, getFirstName, getLoggedInUser };
