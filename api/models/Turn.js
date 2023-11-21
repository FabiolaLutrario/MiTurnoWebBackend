const Sequelize = require("sequelize");
const db = require("./db");
const moment = require("moment");
const BranchOffice = require("./BranchOffice");
const Horary = require("./Horary");

class Turn extends Sequelize.Model {
  static turnsByUser(userId) {
    return Turn.findAll({
      where: {
        userId,
      },
    });
  }

  static checkTurns(turnDate, horaryId) {
    return Turn.findAll({
      where: {
        turn_date: turnDate,
        horary_id: horaryId,
      },
    });
  }
}
Turn.init(
  {
    //Fecha del turno
    turn_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },

    //Hora del turno:
    //La va a traer desde la tabla "Horary"

    //Día en el cual se reservó el turno
    reservation_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    //Hora en la cual se reservó el turno
    reservation_time: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    /*     Número de télefono a preferencia del 
    usuario al momento de generar el turno */
    phone_number: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    confirmation: {
      type: Sequelize.STRING,
    },
    branch_office_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: BranchOffice,
        key: "id",
      },
    },
    horary_id: {
      type: Sequelize.TIME,
      allowNull: false,
      references: {
        model: Horary,
        key: "id",
      },
    },
  },
  { sequelize: db, modelName: "turn" }
);

Turn.beforeCreate((turn) => {
  return (turn.confirmation = "pending");
});

/* Al momento de guardar el turno captura la fecha y hora actual y la guarda en reservationDate y 
reservationTime respectivamente*/
Turn.beforeValidate((turn) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear(); // Obtiene el año (ejemplo: 2023)
  const month = currentDate.getMonth() + 1; // Mes (0-11), así que se suma 1 (ejemplo: 11 para noviembre)
  const day = currentDate.getDate(); // Día del mes (ejemplo: 15)

  // Ejemplo: 15-11-2023
  const date = `${year}-${month}-${day}`;

  // Obtiene la hora actual en el formato HH:mm:ss
  const currentTime = moment().format("HH:mm:ss");

  turn.reservation_date = date;
  turn.reservation_time = currentTime;

  return turn;
});

module.exports = Turn;
