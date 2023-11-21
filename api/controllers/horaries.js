const Horary = require("../models/Horary");
const Turn = require("../models/Turn");
const BranchOffice = require("../models/BranchOffice");
const { Op } = require("sequelize");

class HoraryController {
  static getHorariesByDateAndHoraryBranchOffice(req, res) {
    Turn.findAll({
      where: {
        branch_officeId: req.params.branchOfficeId,
        turn_date: req.params.date,
        confirmation:"pending"
      },
    })
      .then((turns) => {
        if (!turns || turns.length === 0) {
          BranchOffice.findByPk(req.params.branchOfficeId).then(
            (branchOffice) => {
              if (!branchOffice || branchOffice.length === 0)
                return res.status(404).send("Branch Office not available");
              Horary.findAll({
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
          const horaryId = turn.horaryId;

          if (!grouped[horaryId]) {
            grouped[horaryId] = [];
          }

          grouped[horaryId].push(turn);
          return grouped;
        }, {});

        return turnsGroupedByHoraryId;
      })
      .then((turnsGroupedByHoraryId) => {
        BranchOffice.findByPk(req.params.branchOfficeId).then(
          (branchOffice) => {
            // Filtrar los horarios obteniendo aquellos que no estan disponibles
            /*(No están disponibles si la cantidad de turnos para ese horario
      excede o iguala la cantidad de boxes*/
            const unavailableHoraries = Object.keys(
              turnsGroupedByHoraryId
            ).filter(
              (horaryId) =>
                turnsGroupedByHoraryId[horaryId].length >= branchOffice.boxes
            );
            Horary.findAll({
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
