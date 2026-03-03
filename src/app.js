const express = require("express");
const UserRoute = require("./routes/user.route");

const app = express();
app.use(express.json());

app.use("/api/users", UserRoute);

module.exports = app;
