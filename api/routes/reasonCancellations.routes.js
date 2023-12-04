const express = require("express");
const ReasonCancellationsController = require("../controllers/reasonCancellations.controllers");
const { validateAuth } = require("../middlewares/validateAuth");
const router = express.Router();

router.get("/", validateAuth, ReasonCancellationsController.getAll);

module.exports = router;