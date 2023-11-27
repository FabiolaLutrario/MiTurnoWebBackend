const express = require("express");
const HorariesController = require("../controllers/horaries.controllers");
const router = express.Router();

router.get("/", HorariesController.allHoraries);
router.get(
  "/:date/:branchOfficeId",
  HorariesController.getHorariesByDateAndHoraryBranchOffice
);

module.exports = router;
