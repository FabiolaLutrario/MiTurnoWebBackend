const express = require("express");
const router = express.Router();
const BranchOfficesControler = require("../controllers/branchOffices.controllers");

router.post("/create", BranchOfficesControler.create);
router.get("/single/:id", BranchOfficesControler.single);
router.get("/all", BranchOfficesControler.all);
router.put("/edit/:id", BranchOfficesControler.edit);
router.delete("/delete/:id", BranchOfficesControler.delete);

module.exports = router;
