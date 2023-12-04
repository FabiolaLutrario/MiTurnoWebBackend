const express = require("express");
const router = express.Router();
const users = require("./users.routes");
const turns = require("./turns.routes");
const roles = require("./roles.routes");
const branchOffices = require("./branchOffices.routes");
const horaries = require("./horaries.routes");
const reasonCancellations = require("./reasonCancellations.routes");

router.use("/users", users);
router.use("/turns", turns);
router.use("/roles", roles);
router.use("/branch-offices", branchOffices);
router.use("/horaries", horaries);
router.use("/reason-cancellations", reasonCancellations);

module.exports = router;
