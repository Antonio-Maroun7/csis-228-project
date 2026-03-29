const express = require("express");
const servicesControler = require("../controllers/services.controller");
const {} = require("../validators/service.validator");

const router = express.Router();

router.get("/", servicesControler.getAllServices);
module.exports = router;
