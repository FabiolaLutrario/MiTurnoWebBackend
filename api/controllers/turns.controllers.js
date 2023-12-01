const { transporter } = require("../config/mailer.config");
const Turn = require("../models/Turn.models");
const User = require("../models/User.models");
const BranchOffice = require("../models/BranchOffice.models");
const moment = require("moment");
const { Op } = require("sequelize");

class TurnsController {
  static generateTurn(req, res) {
    const currentDate = moment();
    const currentTime = moment().format("HH:mm:ss");
    const { turn_date, horary_id, branch_office_id, full_name, phone_number } =
      req.body; //Desde el front estará el select en donde en cada option del select se mostrará {branchOffice.name} pero al seleccionar una option el value será branchOffice.id

    if (
      !turn_date ||
      !horary_id ||
      !branch_office_id ||
      !full_name ||
      !phone_number
    ) {
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
      moment(turn_date).isBefore(minDate, "day") ||
      moment(turn_date).isAfter(maxDate, "day")
    ) {
      return res.status(400).send({
        error:
          "The selected date must be within the range of up to 31 days before or after the current date",
      });
    }

    // Verifica si la fecha proporcionada no es sábado ni domingo (bloquear esos días también desde el front con el calendar)
    const dayOfWeek = moment(turn_date).day();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res
        .status(400)
        .send({ error: "The selected date is a Saturday or Sunday" });
    }

    // Verifica si la fecha proporcionada es anterior a la fecha actual (bloquear también los días anteriores a la fecha actual desde el front con el calendar)
    if (moment(turn_date).isBefore(currentDate, "day")) {
      return res
        .status(400)
        .send({ error: "The selected date is before the current date" });
    }

    /* A continuación va a buscar el user por id, cuando lo encuentre va a buscar la  branchOffice por id,
    y cuando la encuentre va a verificar si aún hay turno disponible para la fecha y hora seleccionadas; cuando pase esas validaciones va a crear el turno*/
    User.findByPk(req.params.user_id)
      .then((user) => {
        BranchOffice.findByPk(req.body.branch_office_id).then(
          (branch_office) => {
            Turn.checkTurns(turn_date, horary_id).then((turns) => {
              if (turns.length >= branch_office.boxes)
                return res
                  .status(400)
                  .send(
                    "The turn on the selected day and time is no longer available."
                  );
              Turn.create({
                turn_date,
                full_name,
                phone_number,
                horary_id,
                confirmation_id: "pending",
                reservation_date: currentDate,
                reservation_time: currentTime,
                branch_office_id,
                user_id: user.id,
              }).then((turn) => {
                const info = transporter.sendMail({
                  from: '"Confirmación de turno" <turnoweb.mailing@gmail.com>',
                  to: user.email,
                  subject: "Confirmación de turno ✔",
                  html: `<p>Hola ${
                    user.full_name
                  }! Nos comunicamos de "Mi Turno Web" para confirmar que tu turno del ${
                    turn.turn_date
                  } a las ${turn.horary_id.slice(
                    0,
                    5
                  )} fue reservado satisfactoriamente. Te esperamos en nuestra sucursal de ${
                    branch_office.name
                  }.
                  Muchas gracias por confiar en nosotros!</p>`,
                });
                info.then(() => {
                  res.status(201).send(turn);
                });
              });
            });
          }
        );
      })
      .catch((error) => {
        console.error("Error when trying to generate turn:", error);
        return res.status(500).send("Internal Server Error");
      });
  }

  static getAllTurnsByConfirmationAndBranchOfficeId(req, res) {
    Turn.findAll({
      where: {
        confirmation_id: req.params.confirmation_id,
        branch_office_id: req.params.branch_office_id,
      },
      include: [
        { model: BranchOffice, as: "branch_office" },
        { model: User, as: "user", attributes: ["full_name"] },
      ],
    })
      .then((turns) => {
        if (!turns)
          return res
            .status(404)
            .send("There are no turns in state: ", req.params.confirmation_id);
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
      include: { model: BranchOffice, as: "branch_office" },
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

  static confirmTurn(req, res) {
    const { id } = req.params;

    Turn.update(
      { confirmation_id: "confirmed" },
      { where: { id }, returning: true }
    )
      .then(([rows, turns]) => {
        res.status(200).send(turns[0]);
      })
      .catch((error) => {
        console.error("Error when trying to confirm turn:", error);
        return res.status(500).send("Internal Server Error");
      });
  }

  static cancelTurn(req, res) {
    const { id } = req.params;
    const { reason_cancellation } = req.body;

    if (!reason_cancellation)
      return res.status(400).send({
        error: "The reason for cancellation of the turn is required.",
      });

    Turn.update(
      { confirmation_id: "cancelled", reason_cancellation },
      { where: { id }, returning: true }
    )
      .then(([rows, turns]) => {
        res.status(200).send(turns[0]);
      })
      .catch((error) => {
        console.error("Error when trying to cancelled turn:", error);
        return res.status(500).send("Internal Server Error");
      });
  }

  static all(req, res) {
    Turn.findAll()
      .then((turns) => {
        res.status(200).send(turns);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  }
}
module.exports = TurnsController;
