const { transporter } = require("../config/mailer");
const Turn = require("../models/Turn");
const User = require("../models/User");
const BranchOffice = require("../models/BranchOffice");

class TurnsController {
  static generateTurn(req, res) {
    const currentDate = moment();
    const { turnDate, startTimeTurn, phoneNumber, branchOfficeId } = req.body; //Desde el front estará el select en donde en cada option del select se mostrará {branchOffice.name} pero al seleccionar una option el value será branchOffice.id

    if (!turnDate || !startTimeTurn || !phoneNumber || !branchOfficeId) {
      return res
        .status(400)
        .send({ error: "Todos los campos son obligatorios" });
    }

    /*Para verificar o preveer que no se seleccione un día feriado hacerlo desde el calendar del front bloqueando los días feriados y que no deje escribir las fechas a mano sino que únicamente se  pueda seleccionar la fecha desde el calendar (bloquear input de fecha). */

    //Desde el front habilitar fechas en el calendar sólo en el rango de 1 mes en curso (31 días) partiendo desde currentDate. Se va habilitando una nueva fecha a mediada que pasa un día.
    /*Y desde el back hacemos también la verificación para ver si la fecha está dentro del rango de hasta
      31 días antes o después de la fecha actual*/
    const minDate = moment().subtract(31, "days");
    const maxDate = moment().add(31, "days");

    if (
      moment(turnDate).isBefore(minDate, "day") ||
      moment(turnDate).isAfter(maxDate, "day")
    ) {
      return res.status(400).send({
        error:
          "The selected date must be within the range of up to 31 days before or after the current date",
      });
    }

    // Verifica si la fecha proporcionada no es sábado ni domingo (bloquear esos días también desde el front con el calendar)
    const dayOfWeek = moment(turnDate).day();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res
        .status(400)
        .send({ error: "The selected date is a Saturday or Sunday" });
    }

    // Verifica si la fecha proporcionada es anterior a la fecha actual (bloquear también los días anteriores a la fecha actual desde el front con el calendar)
    if (moment(turnDate).isBefore(currentDate, "day")) {
      return res
        .status(400)
        .send({ error: "The selected date is before the current date" });
    }

    /* A continuación va a buscar el user por id, cuando lo encuentre va a buscar la  branchOffice por id,
    y cuando la encuentre va a verificar si el turno en la fecha y hora seleccionados aún siguen disponibles; cuando pase esas validaciones va a crear el turno y luego hace un setUser(user) y un setBranchOffice(branchOffice). Se hace de esta forma para que al devolver el turn al front vaya con todos las campos(datos) de user y branchOffice*/
    User.findByPk(req.params.userId)
      .then((user) => {
        BranchOffice.findByPk(req.body.branchOfficeId).then((branchOffice) => {
          Turn.checkIfItIsAvailable(turnDate, startTimeTurn).then((turn) => {
            if (turn)
              return res
                .status(400)
                .send(
                  "The turn on the selected day and time is no longer available"
                );
            Turn.create({
              turnDate,
              startTimeTurn,
              phoneNumber,
            }).then((turn) => {
              turn.setUser(user);
              turn.setBranchOffice(branchOffice);
              res.status(201).send(turn);
            });
          });
        });
      })
      .catch((error) => {
        console.error("Error when trying to generate turn:", error);
        return res.status(500).send("Internal Server Error");
      });
  }

  /* Verifica si hay turnos disponibles para determinada fecha; si retorna false se bloquea esa fecha en el calendar del front*/
  static areTurnsAvailable(req, res) {
    Turn.findAll({
      where: {
        confirmation: "pending",
        turnDate: req.params.date,
      },
    })
      .then((turns) => {
        if (turns.length >= 20) return res.status(404).send(false);
        return res.status(200).send(true);
      })
      .catch((error) => {
        console.error("Error when trying to get available turns:", error);
        return res.status(500).send("Internal Server Error");
      });
  }

  static getAllTurnsByConfirmation(req, res) {
    Turn.findAll({
      where: {
        confirmation: req.params.confirmation,
      },
    })
      .then((turns) => {
        return res.status(200).send(turns);
      })
      .catch((error) => {
        console.error("Error when trying to get turns:", error);
        return res.status(500).send("Internal Server Error");
      });
  }

  static getTurn(req, res) {
    Turn.findOne({
      where: {
        id: req.params.id,
      },
    })
      .then((turn) => {
        if (!turn) return res.sendStatus(404);
        res.status(200).send(turn);
      })
      .catch((error) => {
        console.error("Error when trying to get turn:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
  static changeTurnConfirmation(req, res) {
    const { id } = req.params;

    Turn.update(
      { confirmation: req.body.confirmation },
      { where: { id }, returning: true }
    )
      .then(([rows, turns]) => {
        res.status(200).send(turns[0]);
      })
      .catch((error) => {
        console.error("Error when trying to update turn confirmation:", error);
        return res.status(500).send("Internal Server Error");
      });
  }

  static modifyTurn(req, res) {
    /*     const { id } = req.params;

    Turn.update(
      req.body, { where: { id }, returning: true }
    )
      .then(([rows, turns]) => {
        res.status(200).send(turns[0]);
      })
      .catch((error) => {
        console.error("Error when trying to update turn confirmation:", error);
        return res.status(500).send("Internal Server Error");
      }); */
  }
}
module.exports = TurnsController;
