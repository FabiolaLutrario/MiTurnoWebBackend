const Sequelize = require("sequelize");
const db = require("./db");

class Horary extends Sequelize.Model {}
Horary.init(
  {
    id: {
      type: Sequelize.TIME,
      primaryKey: true,
    },
  },
  { sequelize: db, modelName: "horary" }
);

module.exports = Horary;
