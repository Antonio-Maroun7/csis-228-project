/**
 * Configures the Express application and mounts all API route groups.
 */
const express = require("express");
const path = require("path");

const UserRoute = require("./routes/user.route");
const staffServiceRoute = require("./routes/staffService.route");
const serviceRoute = require("./routes/services.route");
const CategoryRoute = require("./routes/category.route");
const AppointmentRoute = require("./routes/appointment.route");
const AppointmentItemRoute = require("./routes/appointment_item.route");
const AuthRoute = require("./routes/auth.routes");

const viewRoute = require("./routes/view.routes");

const app = express();

/**
 * EJS setup
 * app.set("view engine", "ejs")
 * app.set("views", ...)
 */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());

//  allows Express to read form data from the frontend.
app.use(express.urlencoded({ extended: true }));

// Serve static assets (images, css, js) from src/public/
app.use(express.static(path.join(__dirname, "public")));

app.use("/", viewRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/appointmentItems", AppointmentItemRoute);
app.use("/api/appointments", AppointmentRoute);
app.use("/api/categories", CategoryRoute);
app.use("/api/services", serviceRoute);
app.use("/api/users", UserRoute);
app.use("/api/staffServices", staffServiceRoute);

// Global 404 handler — must be registered after all routes
app.use((req, res) => {
  const user = req.user || null;
  res.status(404).render("errors/not-found", {
    title: "Page Not Found",
    user,
    activePage: "not-found",
    message: "The page you are looking for does not exist.",
    messageType: "error",
  });
});

module.exports = app;
