const express = require("express");
const HorariesController = require("../controllers/horaries");
const router = express.Router();

router.get(
  "/:date/:branchOfficeId",
  HorariesController.getHorariesByDateAndHoraryBranchOffice
);

module.exports = router;
