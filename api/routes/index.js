const express = require("express");
const router = express.Router();
const users = require("./users");
const turns = require("./turns");
const roles = require("./roles");
const branchOffices = require("./branchOffices");
const horaries = require("./horaries");

router.use("/users", users);
router.use("/turns", turns);
router.use("/roles", roles);
router.use("/branch-offices", branchOffices);
router.use("/horaries", horaries);

module.exports = router;
