const express = require("express");
const router = express.Router();
const BranchOfficesControler = require("../controllers/branchOffices.controllers");

router.get("/", BranchOfficesControler.all);
router.get("/single/:id", BranchOfficesControler.single);
router.get("/unavailable-days/:id", BranchOfficesControler.unavailableDays);

//Con permisos admin y super admin:
router.post("/create", BranchOfficesControler.create);
router.put("/edit/:id", BranchOfficesControler.edit);
/* Para eliminar una sucursal hay que tomar en cuenta la restricción de llave foránea */
router.delete("/:id", BranchOfficesControler.delete);

module.exports = router;
