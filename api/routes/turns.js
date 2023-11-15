const express = require("express");
const TurnsController = require("../controllers/turns");
const router = express.Router();

router.post("/generateTurn/:userId", TurnsController.generateTurn);
router.get("/availableTurns/:date", TurnsController.areTurnsAvailable);
router.get(
  "/turnsByConfirmation/:confirmation",
  TurnsController.getAllTurnsByConfirmation
);
router.get("/:id", TurnsController.getTurn);
router.put("/turnConfirmation/:id", TurnsController.changeTurnConfirmation);
router.put("/:id", TurnsController.modifyTurn);

module.exports = router;
