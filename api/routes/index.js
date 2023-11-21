const express = require("express");
const router = express.Router();
const users = require("./users");
const userAdmin = require("./userAdmin");
const branch = require("./branch");

router.use("/users", users);
router.use("/userAdmin", userAdmin);
router.use("/branch", branch);

module.exports = router;
