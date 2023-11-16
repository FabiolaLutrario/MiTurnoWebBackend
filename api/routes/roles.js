const express = require("express");
const RolesController = require("../controllers/roles");
const router = express.Router();

router.get("/allRoles", RolesController.getAllRoles);

module.exports = router;
