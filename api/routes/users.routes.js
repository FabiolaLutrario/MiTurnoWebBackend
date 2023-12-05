const express = require("express");
const UsersController = require("../controllers/users.controllers");
const { validateAuth } = require("../middlewares/validateAuth");
const { validateAuthAdmin } = require("../middlewares/validateAuthAdmin");
const router = express.Router();

router.post("/register", UsersController.register);
router.post("/login", UsersController.login);
router.post("/logout", UsersController.logout);
router.post("/overwrite-password/:token", UsersController.overwritePassword);
router.get("/me", UsersController.validateAuthUser);
router.get("/single/:id", validateAuth, UsersController.getSingleUser);
router.get(
  "validate-token/:token",
  UsersController.validateTokenToRestorePassword
);
router.put("/edit-user/:user_id", validateAuth, UsersController.editProfile);
router.put("/restore-password", UsersController.sendEmail);
router.put("/confirm-email/:token", UsersController.confirmEmail);
router.put("/change-password/:user_id", UsersController.changePassword);

//Con permisos admin y super admin
router.post(
  "/register-operator",
  validateAuthAdmin,
  UsersController.registerOperator
);
router.get("/", validateAuthAdmin, UsersController.getAllUsers);
router.get("/operators", validateAuthAdmin, UsersController.getOperators);
router.put(
  "/change-role/:user_id",
  validateAuthAdmin,
  UsersController.changeRole
);
router.put(
  "/edit-user-from-admin/:user_id",
  validateAuthAdmin,
  UsersController.editProfileFromAdmin
);
/* Para eliminar un usuario hay que tomar en cuenta la restricción de llave foránea; y en la lógica del método deleteUser no va permitir que se pueda eliminar un super admin*/
router.delete("/:id", validateAuthAdmin, UsersController.deleteUser);

module.exports = router;
