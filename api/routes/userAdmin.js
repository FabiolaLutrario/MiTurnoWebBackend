const express = require("express");
const UserAdminController = require("../controllers/userAdmin");
const router = express.Router();

router.get("/allUsers", UserAdminController.getAllUsers);
router.put(
  "/promoteToAdmin/:userId",
  UserAdminController.promoteOrRevokeAdminPermissions
);
router.delete("/user/:id", UserAdminController.deleteUser);
router.post("/new-operator", UserAdminController.operator);

module.exports = router;
