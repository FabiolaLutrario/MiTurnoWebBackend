const express = require("express");
const TurnsController = require("../controllers/turns.controllers");
const router = express.Router();

router.post("/:user_id", TurnsController.generateTurn);
router.get(
  "/by-confirmation-and-branch-office/:confirmation_id/:branch_office_id",
  TurnsController.getAllTurnsByConfirmationAndBranchOfficeId
);
router.get("/:id", TurnsController.getTurn);
router.put("/turn-confirmation/:id", TurnsController.changeTurnConfirmation);
//router.put("/:id", TurnsController.modifyTurn);
router.get("/", TurnsController.all);

module.exports = router;
