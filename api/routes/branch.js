const express = require("express");
const router = express.Router();
const BranchesControler = require("../controllers/branch");

router.post("/create", BranchesControler.create);
router.get("/single/:id", BranchesControler.single);
router.get("/all", BranchesControler.all);
router.put("/edit/:id", BranchesControler.edit);
router.delete("/delete/:id", BranchesControler.delete);

module.exports = router;
