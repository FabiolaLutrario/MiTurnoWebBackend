const Role = require("../models/Role.models");

class RolesController {
  static getAllRoles(req, res) {
    Role.findAll()
      .then((roles) => {
        if (!roles) return res.sendStatus(404);
        return res.status(200).send(roles);
      })
      .catch((error) => {
        console.error("Error getting roles:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
}
module.exports = RolesController;
