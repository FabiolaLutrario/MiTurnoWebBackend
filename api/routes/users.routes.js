const express = require("express");
const UsersController = require("../controllers/users.controllers");
const router = express.Router();

router.post("/register", UsersController.register);
router.post("/login", UsersController.login);
router.post("/logout", UsersController.logout);
router.post("/overwrite-password/:token", UsersController.overwritePassword);
router.get("/me", UsersController.validateAuthUser);
router.get("/single/:id", UsersController.getSingleUser);
router.get(
  "validate-token/:token",
  UsersController.validateTokenToRestorePassword
);
router.put("/edit-user/:user_id", UsersController.editProfile);
router.put("/restore-password", UsersController.sendEmail);
router.put("/confirm-email/:token", UsersController.confirmEmail);

//Con permisos admin y super admin
router.post("/register-operator", UsersController.registerOperator);
router.get("/", UsersController.getAllUsers);
router.get("/operators", UsersController.getOperators);

//Con permiso super admin
router.put("/change-role/:user_id", UsersController.changeRole);
/* Para eliminar un usuario hay que tomar en cuenta la restricción de llave foránea */
router.delete("/:id", UsersController.deleteUser);

module.exports = router;
