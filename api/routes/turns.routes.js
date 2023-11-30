const express = require("express");
const TurnsController = require("../controllers/turns.controllers");
const router = express.Router();

router.post("/:user_id", TurnsController.generateTurn);
router.get("/", TurnsController.all);
router.get("/:id", TurnsController.getTurn);
router.get(
  "/by-confirmation-and-branch-office/:confirmation_id/:branch_office_id",
  TurnsController.getAllTurnsByConfirmationAndBranchOfficeId
);

//Con permisos operator, admin y super admin
router.put("/confirm-turn/:id", TurnsController.confirmTurn);
router.put("/cancel-turn/:id", TurnsController.cancelTurn);

module.exports = router;
