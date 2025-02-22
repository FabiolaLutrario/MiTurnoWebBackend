const Sequelize = require("sequelize");
const db = require("./db");
const BranchOffice = require("./BranchOffice.models");
const Horary = require("./Horary.models");
const User = require("./User.models");
const Confirmation = require("./Confirmation.models");
const ReasonCancellation = require("./ReasonCancellation.models");

class Turn extends Sequelize.Model {
  static turnsByUser(userId) {
    return Turn.findAll({
      where: {
        userId,
      },
    });
  }

  static checkTurns(turnDate, horaryId, branch_office_id) {
    return Turn.findAll({
      where: {
        turn_date: turnDate,
        horary_id: horaryId,
        confirmation_id: "pending",
        branch_office_id: branch_office_id,
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
    confirmation_id: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: Confirmation,
        key: "id",
      },
    },
    reason_cancellation_id: {
      type: Sequelize.INTEGER,
      references: {
        model: ReasonCancellation,
        key: "id",
      },
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
    full_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone_number: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "turn" }
);

module.exports = Turn;
