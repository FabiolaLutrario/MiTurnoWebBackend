const Horary = require("../models/Horary.models");
const Turn = require("../models/Turn.models");
const BranchOffice = require("../models/BranchOffice.models");
const { Op } = require("sequelize");

class HoraryController {
  static getHorariesByDateAndHoraryBranchOffice(req, res) {
    Turn.findAll({
      where: {
        branch_office_id: req.params.branchOfficeId,
        turn_date: req.params.date,
        confirmation: "pending",
      },
    })
      .then((turns) => {
        if (!turns || turns.length === 0) {
          return BranchOffice.findByPk(req.params.branchOfficeId).then(
            (branchOffice) => {
              if (!branchOffice || branchOffice.length === 0) {
                return res.status(404).send("Branch Office not available");
              }

              return Horary.findAll({
                where: {
                  id: {
                    [Op.between]: [
                      branchOffice.opening_time,
                      branchOffice.closing_time,
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
          const horaryId = turn.horary_id;

          if (!grouped[horaryId]) {
            grouped[horaryId] = [];
          }

          grouped[horaryId].push(turn);
          return grouped;
        }, {});

        return BranchOffice.findByPk(req.params.branchOfficeId).then(
          (branchOffice) => {
            const unavailableHoraries = Object.keys(
              turnsGroupedByHoraryId
            ).filter(
              (horaryId) =>
                turnsGroupedByHoraryId[horaryId].length >= branchOffice.boxes
            );

            return Horary.findAll({
              where: {
                id: {
                  [Op.between]: [
                    branchOffice.opening_time,
                    branchOffice.closing_time,
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
