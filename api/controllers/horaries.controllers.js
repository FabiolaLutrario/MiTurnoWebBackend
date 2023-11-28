const Horary = require("../models/Horary.models");
const Turn = require("../models/Turn.models");
const BranchOffice = require("../models/BranchOffice.models");
const { Op } = require("sequelize");

class HoraryController {
  static getHorariesByDateAndHoraryBranchOffice(req, res) {
    Turn.findAll({
      where: {
        branch_office_id: req.params.branch_office_id,
        turn_date: req.params.date,
        confirmation: "pending",
      },
    })
      .then((turns) => {
        if (!turns || turns.length === 0) {
          return BranchOffice.findByPk(req.params.branch_office_id).then(
            (branch_office) => {
              if (!branch_office || branch_office.length === 0) {
                return res.status(404).send("Branch Office not available");
              }

              return Horary.findAll({
                where: {
                  id: {
                    [Op.between]: [
                      branch_office.opening_time,
                      branch_office.closing_time,
                    ],
                  },
                },
              }).then((horaries) => {
                return res.status(200).send(horaries);
              });
            }
          );
        }

        const turnsGroupedByHoraryId = turns.reduce((grouped, turn) => {
          const horary_id = turn.horary_id;

          if (!grouped[horary_id]) {
            grouped[horary_id] = [];
          }

          grouped[horary_id].push(turn);
          return grouped;
        }, {});

        return BranchOffice.findByPk(req.params.branch_office_id).then(
          (branch_office) => {
            const unavailableHoraries = Object.keys(
              turnsGroupedByHoraryId
            ).filter(
              (horary_id) =>
                turnsGroupedByHoraryId[horary_id].length >= branch_office.boxes
            );

            return Horary.findAll({
              where: {
                id: {
                  [Op.between]: [
                    branch_office.opening_time,
                    branch_office.closing_time,
                  ],
                  [Op.notIn]: unavailableHoraries,
                },
              },
            }).then((horaries) => {
              return res.status(200).send(horaries);
            });
          }
        );
      })
      .catch((error) => {
        console.error("Error when trying to get horaries:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
}
module.exports = HoraryController;
