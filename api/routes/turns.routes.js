const express = require("express");
const TurnsController = require("../controllers/turns.controllers");
const { validateAuth } = require("../middlewares/validateAuth");
const {validateAuthOperator} = require("../middlewares/validateAuthOperator");
const {validateAuthAdmin} = require("../middlewares/validateAuthAdmin");
const router = express.Router();

router.post("/:user_id",validateAuth, TurnsController.generateTurn);
router.get("/:id", validateAuth, TurnsController.getTurn);
router.get(
  "/by-confirmation-and-user/:confirmation_id/:user_id", validateAuth,
  TurnsController.getAllTurnsByConfirmationAndUser
);
router.put("/cancel-turn/:id",validateAuth, TurnsController.cancelTurn);

//Con permisos admin y super admin
router.get("/", validateAuthAdmin, TurnsController.all);

//Con permisos operator, admin y super admin
router.get(
  "/by-confirmation-and-branch-office/:confirmation_id/:branch_office_id", validateAuthOperator, 
  TurnsController.getAllTurnsByConfirmationAndBranchOfficeId
);
router.put("/confirm-turn/:id", validateAuthOperator, TurnsController.confirmTurn);

module.exports = router;
