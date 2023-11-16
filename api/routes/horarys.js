const express = require("express");
const HorarysController = require("../controllers/horarys");
const router = express.Router();

router.get(
  "/:date/:branchOfficeId",
  HorarysController.getHorarysByDateAndHoraryBranchOffice
);

module.exports = router;
