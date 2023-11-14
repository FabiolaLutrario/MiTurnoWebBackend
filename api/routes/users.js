const express = require("express");
const UsersController = require("../controllers/users");
const router = express.Router();

router.post("/register", UsersController.register);
router.post("/login", UsersController.login);
router.get("/me", UsersController.validateAuthUser);
router.get("/singleUser/:id", UsersController.getSingleUser);
router.post("/logout", UsersController.logout);
router.put("/editProlife/:userId", UsersController.editProlife);
router.put("/restore-password", UsersController.sendEmail);
router.get(
  "/token-restore-password/:token",
  UsersController.validateTokenToRestorePassword
);
router.post("/overwrite-password/:token", UsersController.overwritePassword);

module.exports = router;
