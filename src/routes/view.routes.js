const express = require("express");
const router = express.Router();

const viewController = require("../controllers/view.controller");

router.get("/test", (req, res) => {
  res.render("test");
});

module.exports = router;
