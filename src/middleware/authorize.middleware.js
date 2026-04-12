const AppointmentRepository = require("../repositories/appointment.repository");
const AppointmentItemRepository = require("../repositories/appointment_item.repository");

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

/**
 * Allows access when requester owns an id field in request body,
 * or when requester has one of the bypass roles.
 *
 * @param {string[]} [bypassRoles=[]]
 * @param {string} [idField="staff_id"]
 * @returns {import("express").RequestHandler}
 */
authorize.selfByBodyIdOrRoles = (bypassRoles = [], idField = "staff_id") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userRole = req.user.role;
    if (bypassRoles.includes(userRole)) {
      return next();
    }

    const currentUserId = Number(req.user.id);
    const targetUserId = Number(req.body?.[idField]);
    if (Number.isFinite(currentUserId) && currentUserId === targetUserId) {
      return next();
    }

    return res.status(403).json({ error: "Access denied" });
  };
};

/**
 * Allows access when requester owns an id in route params,
 * or when requester has one of the bypass roles.
 *
 * @param {string[]} [bypassRoles=[]]
 * @param {string} [idParam="id"]
 * @returns {import("express").RequestHandler}
 */
authorize.selfByParamIdOrRoles = (bypassRoles = [], idParam = "id") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const userRole = req.user.role;
    if (bypassRoles.includes(userRole)) {
      return next();
    }

    const currentUserId = Number(req.user.id);
    const targetUserId = Number(req.params?.[idParam]);
    if (Number.isFinite(currentUserId) && currentUserId === targetUserId) {
      return next();
    }

    return res.status(403).json({ error: "Access denied" });
  };
};

/**
 * Allows access to an appointment when requester has a bypass role,
 * or requester is the appointment client/staff owner.
 *
 * @param {string[]} [bypassRoles=[]]
 * @param {string} [appointmentIdParam="id"]
 * @returns {import("express").RequestHandler}
 */
authorize.selfByAppointmentIdOrRoles = (
  bypassRoles = [],
  appointmentIdParam = "id",
) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const userRole = req.user.role;
      if (bypassRoles.includes(userRole)) {
        return next();
      }

      const appointmentId = Number(req.params?.[appointmentIdParam]);
      if (!Number.isFinite(appointmentId)) {
        return res.status(400).json({ error: "Invalid appointment id" });
      }

      const appointment =
        await AppointmentRepository.findAppointmentById(appointmentId);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      const currentUserId = Number(req.user.id);
      const isOwner =
        Number.isFinite(currentUserId) &&
        (currentUserId === Number(appointment.client_id) ||
          currentUserId === Number(appointment.staff_id));

      if (isOwner) {
        return next();
      }

      return res.status(403).json({ error: "Access denied" });
    } catch (error) {
      return next(error);
    }
  };
};

/**
 * Allows access to an appointment identified in request body when requester
 * has a bypass role, or requester is the appointment client/staff owner.
 *
 * @param {string[]} [bypassRoles=[]]
 * @param {string} [appointmentIdField="appointment_id"]
 * @returns {import("express").RequestHandler}
 */
authorize.selfByAppointmentBodyIdOrRoles = (
  bypassRoles = [],
  appointmentIdField = "appointment_id",
) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const userRole = req.user.role;
      if (bypassRoles.includes(userRole)) {
        return next();
      }

      const appointmentId = Number(req.body?.[appointmentIdField]);
      if (!Number.isFinite(appointmentId)) {
        return res.status(400).json({ error: "Invalid appointment id" });
      }

      const appointment =
        await AppointmentRepository.findAppointmentById(appointmentId);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      const currentUserId = Number(req.user.id);
      const isOwner =
        Number.isFinite(currentUserId) &&
        (currentUserId === Number(appointment.client_id) ||
          currentUserId === Number(appointment.staff_id));

      if (isOwner) {
        return next();
      }

      return res.status(403).json({ error: "Access denied" });
    } catch (error) {
      return next(error);
    }
  };
};

/**
 * Allows access to an appointment item when requester has a bypass role,
 * or requester owns the parent appointment as client/staff.
 *
 * @param {string[]} [bypassRoles=[]]
 * @param {string} [appointmentItemIdParam="id"]
 * @returns {import("express").RequestHandler}
 */
authorize.selfByAppointmentItemIdOrRoles = (
  bypassRoles = [],
  appointmentItemIdParam = "id",
) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const userRole = req.user.role;
      if (bypassRoles.includes(userRole)) {
        return next();
      }

      const appointmentItemId = Number(req.params?.[appointmentItemIdParam]);
      if (!Number.isFinite(appointmentItemId)) {
        return res.status(400).json({ error: "Invalid appointment item id" });
      }

      const item =
        await AppointmentItemRepository.findAppointmentItemById(
          appointmentItemId,
        );
      if (!item) {
        return res.status(404).json({ error: "Appointment item not found" });
      }

      const appointment = await AppointmentRepository.findAppointmentById(
        item.appointment_id,
      );
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      const currentUserId = Number(req.user.id);
      const isOwner =
        Number.isFinite(currentUserId) &&
        (currentUserId === Number(appointment.client_id) ||
          currentUserId === Number(appointment.staff_id));

      if (isOwner) {
        return next();
      }

      return res.status(403).json({ error: "Access denied" });
    } catch (error) {
      return next(error);
    }
  };
};

module.exports = authorize;
