const express = require("express");
const UsersController = require("../controllers/users");
const router = express.Router();

router.post("/register", UsersController.register);
router.post("/login", UsersController.login);
router.get("/me", UsersController.validateAuthUser);
router.get("/:id", UsersController.getSingleUser);
router.post("/logout", UsersController.logout);
router.put("/:userId", UsersController.editProfile);
router.put("/restore-password", UsersController.sendEmail);
router.get("validate-token/:token", UsersController.validateTokenToRestorePassword);
router.post("/overwrite-password/:token", UsersController.overwritePassword);

//Con permisos Admin:
router.get("/", UsersController.getAllUsers);
router.put("/promote/:userId", UsersController.promoteOrRevokePermissions);
router.delete("/user/:id", UsersController.deleteUser);

module.exports = router;
