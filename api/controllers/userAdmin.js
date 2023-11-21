const User = require("../models/User");

class UserAdminController {
  static getAllUsers(req, res) {
    User.findAll({
      attributes: { exclude: ["hash", "salt", "token"] },
    })
      .then((users) => {
        if (!users || users.length === 0) return res.sendStatus(404);
        return res.send(users);
      })
      .catch((error) => {
        console.error("Error getting users:", error);
        return res.status(500).send("Internal Server Error");
      });
  }

  /*  Se puede promover usuario de "Client" a "Admin" y viceversa;
  no aplica para el rol Operator porque el perfil Operator lo da de alta
  el admin desde la opción "Creación de operadores" desde la vista/perfil
  del Admin*/
  static promoteOrRevokeAdminPermissions(req, res) {
    const id = req.params.userId;

    User.findOne({ where: { id } })
      .then((user) => {
        if (!user) return res.sendStatus(404);

        /* Si un usuario en el que al momento de registrarlo en la base de datos inició
      con un rol Admin por defecto no se puede autorevocar su permiso de Admin*/
        if (user.initialRole === "Admin")
          return res.status(400).send("A superuser cannot be demoted");

        /*       Si pasa todas las validaciones procede a promover o revocar los permisos 
      de "Admin" al usuario según sea el caso */
        user.role = req.body.role;
        user.save().then(() => {
          res.status(200).send("Successful operation!");
        });
      })
      .catch((error) => {
        console.error(
          "Error when trying to promote or revoke permissions:",
          error
        );
        return res.status(500).send("Internal Server Error");
      });
  }

  static deleteUser(req, res) {
    const id = req.params.id;
    User.destroy({
      where: { id },
    })
      .then((user) => {
        if (!user) return res.sendStatus(404);
        return res.sendStatus(202);
      })
      .catch((error) => {
        console.error("Error when trying to delete user:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
  static operator(req, res) {
    const { fullName, dni, email, password, role, branchOfficeId } = req.body;

    if (!fullName || !dni || !email || !password || !role || !branchOfficeId) {
      return res
        .status(400)
        .send({ error: "Todos los campos son obligatorios" });
    }
    User.create(req.body)
      .then((operator) => {
        res.status(201).send(operator);
      })
      .catch((error) => {
        console.error("Error when trying to register operator:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
}
module.exports = UserAdminController;
