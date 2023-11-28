const express = require("express");
const HorariesController = require("../controllers/horaries.controllers");
const router = express.Router();

router.get(
  "/:date/:branch_office_id",
  HorariesController.getHorariesByDateAndHoraryBranchOffice
);

module.exports = router;
