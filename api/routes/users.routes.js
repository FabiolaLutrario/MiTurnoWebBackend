const express = require("express");
const UsersController = require("../controllers/users.controllers");
const router = express.Router();

router.post("/register", UsersController.register);
router.post("/login", UsersController.login);
router.get("/me", UsersController.validateAuthUser);
router.get("/single/:id", UsersController.getSingleUser);
router.post("/logout", UsersController.logout);
router.put("/edit-user/:user_id", UsersController.editProfile);
router.put("/restore-password", UsersController.sendEmail);
router.get(
  "validate-token/:token",
  UsersController.validateTokenToRestorePassword
);
router.post("/overwrite-password/:token", UsersController.overwritePassword);
router.put("/confirm-email/:token", UsersController.confirmEmail);

//Con permisos Admin:
router.get("/", UsersController.getAllUsers);
router.put("/change-role/:user_id", UsersController.changeRole);
router.delete("/:id", UsersController.deleteUser);
router.post("/register-operator", UsersController.registerOperator);
router.get("/operators", UsersController.getOperators);

module.exports = router;
