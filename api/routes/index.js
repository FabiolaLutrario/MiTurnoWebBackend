const express = require("express");
const router = express.Router();
const users = require("./users");
const userAdmin = require("./userAdmin");
const turns = require("./turns");
const roles = require("./roles");
const branchOffices = require("./branchOffices");
const horarys = require("./horarys");

router.use("/users", users);
router.use("/userAdmin", userAdmin);
router.use("/turns", turns);
router.use("/roles", roles);
router.use("/branchOffices", branchOffices);
router.use("/horarys", horarys);

module.exports = router;
