const Sequelize = require("sequelize");
const db = require("./db");

class BranchOffice extends Sequelize.Model {}
BranchOffice.init(
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    phone_number: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    boxes: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    opening_time: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    closing_time: {
      type: Sequelize.TIME,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: "branch_office" }
);

BranchOffice.sync()
  .then(() => {
    return BranchOffice.count();
  })
  .then((count) => {
    if (count === 0) {
      const branchOfficesToCreate = [
        {
          name: "Yerba Buena",
          email: "juanarismendidiaz@gmail.com",
          phone_number: "3814888082",
          boxes: 4,
          opening_time: "07:30",
          closing_time: "21:30",
        },
        {
          name: "San Miguel",
          email: "juanarismendidiaz@gmail.com",
          phone_number: "3814888082",
          boxes: 4,
          opening_time: "07:30",
          closing_time: "21:30",
        },
      ];
      return BranchOffice.bulkCreate(branchOfficesToCreate);
    }
    return Promise.resolve(); // No es necesario devolver nada si ya hay razones de cancelacióon
  })
  .then(() => {
    console.log("Default branch offices created successfully.");
  })
  .catch((error) => {
    console.error("Error:", error);
  });

module.exports = BranchOffice;
