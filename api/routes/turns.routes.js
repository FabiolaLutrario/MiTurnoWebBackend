const express = require("express");
const TurnsController = require("../controllers/turns.controllers");
const router = express.Router();

router.post("/:userId", TurnsController.generateTurn);
router.get(
  "/by-confirmation-and-branch-office/:confirmation/:branchOfficeId",
  TurnsController.getAllTurnsByConfirmationAndBranchOfficeId
);
router.get("/:id", TurnsController.getTurn);
router.put("/turn-confirmation/:id", TurnsController.changeTurnConfirmation);
//router.put("/:id", TurnsController.modifyTurn);

module.exports = router;
