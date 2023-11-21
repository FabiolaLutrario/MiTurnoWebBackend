const express = require("express");
const TurnsController = require("../controllers/turns");
const router = express.Router();

router.post("/:userId", TurnsController.generateTurn);
router.get(
  "/turns-by-confirmation/:confirmation",
  TurnsController.getAllTurnsByConfirmation
);
router.get("/:id", TurnsController.getTurn);
router.put("/turn-confirmation/:id", TurnsController.changeTurnConfirmation);
router.put("/:id", TurnsController.modifyTurn);

module.exports = router;
