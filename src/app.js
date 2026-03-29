const express = require("express");
const UserRoute = require("./routes/user.route");
const staffServiceRoute = require("./routes/staffService.route");
const serviceRoute = require("./routes/services.route");

const app = express();
app.use(express.json());

app.use("/api/services", serviceRoute);
app.use("/api/users", UserRoute);
app.use("/api/staffServices", staffServiceRoute);

module.exports = app;
