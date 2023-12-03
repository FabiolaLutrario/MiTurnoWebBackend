const express = require("express");
const RolesController = require("../controllers/roles.controllers");
const { validateAuthAdmin } = require("../middlewares/validateAuthAdmin");
const router = express.Router();

router.get("/", validateAuthAdmin, RolesController.getAllRoles);

module.exports = router;
