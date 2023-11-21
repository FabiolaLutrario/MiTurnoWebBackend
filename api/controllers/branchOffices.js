const { BranchOffice } = require("../models");

class BranchOfficesController {
  static create(req, res) {
    const { name, box, openingTime, closingTime } = req.body;
    if (!name || !box || !openingTime || !closingTime) {
      return res
        .status(400)
        .send({ error: "Todos los campos son obligatorios" });
    }
    BranchOffice.create(req.body)
      .then((branch) => {
        res.status(201).send(branch);
      })
      .catch((error) => {
        console.error("Error when trying to create branch:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
  static single(req, res) {
    const id = req.params.id;
    BranchOffice.findByPk(id)
      .then((branch) => {
        res.send(branch);
      })
      .catch((error) => {
        console.error("Error when trying to get branch:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
  static all(req, res) {
    BranchOffice.findAll()
      .then((branchArray) => {
        res.send(branchArray);
      })
      .catch((error) => {
        console.error("Error when trying to get branches:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
  static edit(req, res) {
    const id = req.params.id;
    BranchOffice.update(req.body, { where: { id }, returning: true })
      .then(([rows, branches]) => {
        res.send(branches[0]);
      })
      .catch((error) => {
        console.error("Error when trying to update branch:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
  static delete(req, res) {
    const id = req.params.id;
    BranchOffice.destroy({ where: { id } })
      .then(() => {
        res.status(200).send("Branch deleted sucsessfully");
      })
      .catch((error) => {
        console.error("Error when trying to delete branch:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
}

module.exports = BranchOfficesController;
