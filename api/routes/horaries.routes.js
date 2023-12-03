const express = require("express");
const HorariesController = require("../controllers/horaries.controllers");
const { validateAuth } = require("../middlewares/validateAuth");
const router = express.Router();

router.get("/", validateAuth, HorariesController.allHoraries);
router.get(
  "/:date/:branch_office_id", validateAuth, 
  HorariesController.getHorariesByDateAndHoraryBranchOffice
);

module.exports = router;
