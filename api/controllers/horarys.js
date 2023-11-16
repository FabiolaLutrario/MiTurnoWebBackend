const Horary = require("../models/Horary");
const Turn = require("../models/Turn");
const BranchOffice = require("../models/BranchOffice");
const { Op } = require("sequelize");

class HoraryController {
  static getHorarysByDateAndHoraryBranchOffice(req, res) {
    Turn.findAll({
      where: {
        branchOfficeId: req.params.branchOfficeId,
        turnDate: req.params.date,
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
                      branchOffice.openingTime,
                      branchOffice.closingTime,
                    ],
                  },
                },
              }).then((horarys) => {
                return res.status(200).send(horarys);
              });
            }
          );
        }
        console.log("Oyeeeeeeeeeeeeeeeee ", turns);
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
            const unavailableHorarys = Object.keys(
              turnsGroupedByHoraryId
            ).filter(
              (horaryId) =>
                turnsGroupedByHoraryId[horaryId].length >= branchOffice.boxes
            );
            Horary.findAll({
              where: {
                id: {
                  [Op.between]: [
                    branchOffice.openingTime,
                    branchOffice.closingTime,
                  ],
                  [Op.notIn]: unavailableHorarys,
                },
              },
            }).then((horarys) => {
              return res.status(200).send(horarys);
            });
          }
        );
      })
      .catch((error) => {
        console.error("Error when trying to get horarys:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
}
module.exports = HoraryController;
