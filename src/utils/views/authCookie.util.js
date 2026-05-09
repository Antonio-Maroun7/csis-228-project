"use strict";

function setAuthCookie(res, token) {
  res.cookie("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
  });
}

function clearAuthCookie(res) {
  res.clearCookie("auth_token", {
    httpOnly: true,
    sameSite: "lax",
  });
}

module.exports = { setAuthCookie, clearAuthCookie };
