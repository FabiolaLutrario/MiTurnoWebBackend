const express = require("express");
const RolesController = require("../controllers/roles.controllers");
const router = express.Router();

router.get("/", RolesController.getAllRoles);

module.exports = router;
