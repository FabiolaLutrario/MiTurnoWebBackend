const express = require("express");
const TurnsController = require("../controllers/turns");
const router = express.Router();

router.post("/generateTurn/:userId", TurnsController.generateTurn);

module.exports = router;
