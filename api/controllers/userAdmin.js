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

  static promoteToAdmin(req, res) {
    const { id } = req.params.userId;

    User.update({ rol: "Operator" }, { where: { id }, returning: true })
      .then(([rows, users]) => {
        res.send(users[0]);
      })
      .catch((error) => {
        console.error("Error when trying to update user:", error);
        return res.status(500).send("Internal Server Error");
      });
  }

  static deleteUser(req, res) {
    const { id } = req.params.id;
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
}
module.exports = UserAdminController;
