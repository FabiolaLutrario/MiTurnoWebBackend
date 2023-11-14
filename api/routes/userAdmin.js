const express = require("express");
const UserAdminController = require("../controllers/userAdmin");
const router = express.Router();

router.get("/allUsers", UserAdminController.getAllUsers);
router.put("/promoteToAdmin/:userId", UserAdminController.promoteToAdmin);
router.delete("/user/:id", UserAdminController.deleteUser);

module.exports = router;
