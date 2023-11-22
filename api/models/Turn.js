const Sequelize = require("sequelize");
const db = require("./db");
const moment = require("moment");
const BranchOffice = require("./BranchOffice");
const Horary = require("./Horary");
const User = require("./User");

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
        confirmation: "pending",
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
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
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

/* Al momento de guardar el turno captura la fecha y hora actual y la guarda en reservationDate y 
reservationTime respectivamente*/
Turn.beforeValidate((turn) => {
  const currentDate = new Date();

  // Obtiene la hora actual en el formato HH:mm:ss
  const currentTime = moment().format("HH:mm:ss");

  turn.confirmation = "pending";
  turn.reservation_date = currentDate;
  turn.reservation_time = currentTime;

  return turn;
});

module.exports = Turn;
