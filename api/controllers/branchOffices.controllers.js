const { BranchOffice } = require("../models/index.models");

class BranchOfficesController {
  static create(req, res) {
    const { name, boxes, email, opening_time, closing_time } = req.body;
    if (!name || !boxes || !email || !opening_time || !closing_time) {
      return res
        .status(400)
        .send({ error: "Todos los campos son obligatorios" });
    }
    BranchOffice.create({
      name,
      boxes,
      email,
      opening_time,
      closing_time,
    })
      .then((branch_office) => {
        res.status(201).send(branch_office);
      })
      .catch((error) => {
        console.error("Error when trying to create branch office:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
  static single(req, res) {
    const id = req.params.id;
    BranchOffice.findByPk(id)
      .then((branch_office) => {
        res.send(branch_office);
      })
      .catch((error) => {
        console.error("Error when trying to get branch office:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
  static all(req, res) {
    BranchOffice.findAll()
      .then((branch_offices) => {
        res.send(branch_offices);
      })
      .catch((error) => {
        console.error("Error when trying to get branch offices:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
  static edit(req, res) {
    const id = req.params.id;
    BranchOffice.update(req.body, { where: { id }, returning: true })
      .then(([rows, branch_offices]) => {
        res.send(branch_offices[0]);
      })
      .catch((error) => {
        console.error("Error when trying to update branch office:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
  static delete(req, res) {
    const id = req.params.id;
    BranchOffice.destroy({ where: { id } })
      .then(() => {
        res.status(200).send("Branch office deleted sucsessfully");
      })
      .catch((error) => {
        console.error("Error when trying to delete branch office:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
}

module.exports = BranchOfficesController;
