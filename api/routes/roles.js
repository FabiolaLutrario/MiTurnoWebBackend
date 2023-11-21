const express = require("express");
const RolesController = require("../controllers/roles");
const router = express.Router();

router.get("/", RolesController.getAllRoles);

module.exports = router;
