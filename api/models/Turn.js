const Sequelize = require("sequelize");
const db = require("./db");

class Turn extends Sequelize.Model {
  static turnsByUser(userId) {
    return Turn.findAll({
      where: {
        userId,
      },
    });
  }

  static checkIfItIsAvailable(turnDate, startTimeTurn) {
    return Turn.findOne({
      where: {
        turnDate,
        startTimeTurn,
      },
    });
  }
}
Turn.init(
  {
    //Fecha del turno
    turnDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    //Hora del turno
    startTimeTurn: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    //Día en el cual se reservó el turno
    reservationDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    //Hora en la cual se reservó el turno
    reservationTime: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    /*     Número de télefono a preferencia del 
    usuario al momento de generar el turno */
    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    confirmation: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "turn" }
);

Turn.beforeCreate((turn) => {
  return (turn.confirmation = "pending");
});

/* Al momento de guardar el turno captura la fecha y hora actual y la guarda en reservationDate y 
reservationTime respectivamente*/
Turn.beforeSave((turn) => {
  turn.reservationDate = new Date(); // Captura la fecha actual

  turn.reservationTime = new Date().toLocaleTimeString("es-ES", {
    hour12: false,
  }); // Captura la hora actual en formato de 24 horas (HH:MM:SS)

  return turn;
});

module.exports = Turn;
