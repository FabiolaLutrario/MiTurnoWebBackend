const Role = require("../models/Role");

class RolesController {
  static getAllRoles(req, res) {
    Role.findAll()
      .then((roles) => {
        if (!roles || roles.length === 0) return res.sendStatus(404);
        return res.send(roles);
      })
      .catch((error) => {
        console.error("Error getting roles:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
}
module.exports = RolesController;
