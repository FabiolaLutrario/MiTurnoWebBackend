const Sequelize = require("sequelize");
const db = require("./db");

class Turn extends Sequelize.Model {}
Turn.init(
  {
    startTime: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    confirmation: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "turn" }
);

module.exports = Turn;
