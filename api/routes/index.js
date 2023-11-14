const express = require("express");
const router = express.Router();
const users = require("./users");
const userAdmin = require("./userAdmin");

router.use("/users", users);
router.use("/userAdmin", userAdmin);

module.exports = router;
