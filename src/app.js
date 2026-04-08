const express = require("express");
const UserRoute = require("./routes/user.route");
const staffServiceRoute = require("./routes/staffService.route");
const serviceRoute = require("./routes/services.route");
const CategoryRoute = require("./routes/category.route");
const AppointmentRoute = require("./routes/appointment.route");
const AppointmentItemRoute = require("./routes/appointment_item.route");
const AuthRoute = require("./routes/auth.routes");

const app = express();
app.use(express.json());

app.use("/api/auth", AuthRoute);
app.use("/api/appointmentItems", AppointmentItemRoute);
app.use("/api/appointments", AppointmentRoute);
app.use("/api/categories", CategoryRoute);
app.use("/api/services", serviceRoute);
app.use("/api/users", UserRoute);
app.use("/api/staffServices", staffServiceRoute);

module.exports = app;
