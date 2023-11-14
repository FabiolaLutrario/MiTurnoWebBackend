const Sequelize = require("sequelize");
const db = require("./db");

class BranchOffice extends Sequelize.Model {}
BranchOffice.init(
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    openingTime: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    closingTime: {
      type: Sequelize.TIME,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "branchOffice" }
);

module.exports = BranchOffice;
