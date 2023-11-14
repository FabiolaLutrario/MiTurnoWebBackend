const { transporter } = require("../config/mailer");
const Turn = require("../models/Turn");
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
      return res
        .status(400)
        .send({
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

    /* A continuación va a buscar el user por id; cuando lo encuentre va a buscar la  branchOffice por id
    y cuando la encuentre va a crear el turno y luego hace un setUser(user) y un setBranchOffice(branchOffice). Se hace de esta forma para que al devolver el turn al front vaya con todos las campos(datos) de user y branchOffice*/
    User.findByPk(req.params.userId)
      .then((user) => {
        BranchOffice.findByPk(req.body.branchOfficeId).then((branchOffice) => {
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
      })
      .catch((error) => {
        console.error("Error when trying to generate turn:", error);
        return res.status(500).send("Internal Server Error");
      });
  }
}
module.exports = TurnsController;
