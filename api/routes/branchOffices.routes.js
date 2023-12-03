const express = require("express");
const router = express.Router();
const { validateAuth } = require("../middlewares/validateAuth");
const {validateAuthAdmin} = require("../middlewares/validateAuthAdmin");
const BranchOfficesControler = require("../controllers/branchOffices.controllers");

router.get("/", validateAuth, BranchOfficesControler.all);
router.get("/single/:id", validateAuth, BranchOfficesControler.single);
router.get("/unavailable-days/:id", validateAuth, BranchOfficesControler.unavailableDays);

//Con permisos admin y super admin:
router.post("/create", validateAuthAdmin, BranchOfficesControler.create);
router.put("/edit/:id", validateAuthAdmin, BranchOfficesControler.edit);
/* Para eliminar una sucursal hay que tomar en cuenta la restricción de llave foránea */
router.delete("/:id", validateAuthAdmin, BranchOfficesControler.delete);

module.exports = router;
