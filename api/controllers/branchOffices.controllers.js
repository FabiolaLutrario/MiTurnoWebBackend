const { BranchOffice, Turn } = require("../models/index.models");
const moment = require("moment");
const daysTester = require("../utils/daysTester");

class BranchOfficesController {
  static create(req, res) {
    const { name, boxes, email, phone_number, opening_time, closing_time } =
      req.body;
    if (
      !name ||
      !boxes ||
      !email ||
      !phone_number ||
      !opening_time ||
      !closing_time
    ) {
      return res
        .status(400)
        .send({ error: "Todos los campos son obligatorios" });
    }

    BranchOffice.findOne({ where: { name } })
      .then((existingBranchOffice) => {
        if (existingBranchOffice) {
          return res.status(409).send("Name branch office already exists");
        }

        BranchOffice.findOrCreate({
          where: { email },
          defaults: {
            name,
            boxes,
            email,
            phone_number,
            opening_time,
            closing_time,
          },
        }).then((branchOffices) => {
          if (!branchOffices[1])
            return res.status(409).send("Email already exists");
          res.status(201).send(branchOffices[0]);
        });
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
        if (!branch_office) res.status(404).send("Branch office not found");
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
        res.status(200).send(branch_offices);
      })
      .catch((error) => {
        console.error("Error when trying to get branch offices:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
  static edit(req, res) {
    const id = req.params.id;
    const { name, boxes, email, phone_number, opening_time, closing_time } =
      req.body;
    if (
      !name ||
      !boxes ||
      !email ||
      !phone_number ||
      !opening_time ||
      !closing_time
    ) {
      return res.status(400).send({ error: "All fields are required!" });
    }
    BranchOffice.update(req.body, { where: { id }, returning: true })
      .then(([rows, branch_offices]) => {
        res.status(200).send(branch_offices[0]);
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
        res.status(202).send("Branch office deleted sucsessfully");
      })
      .catch((error) => {
        console.error("Error when trying to delete branch office:", error);
        if (error.name === "SequelizeForeignKeyConstraintError")
          return res.status(409).send(error);
        return res.status(500).send(error);
      });
  }
  static async unavailableDays(req, res) {
    const id = req.params.id;
    BranchOffice.findByPk(id).then((branch) => {
      const maxTurns = daysTester.createMaxTurns(branch);
      const daysToTest = daysTester.createDays();
      daysTester
        .testDays(daysToTest, maxTurns, branch)
        .then((unavailableDays) => {
          res.status(200).send(unavailableDays);
        })
        .catch((error) => {
          console.error("Error when trying to get unavailable days:", error);
          return res.status(500).send("Internal Server Error");
        });
    });
  }
}

module.exports = BranchOfficesController;
