const Sequelize = require("sequelize");
const db = require("./db");

class Confirmation extends Sequelize.Model {}

Confirmation.init(
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      unique: true,
    },
  },
  { sequelize: db, modelName: "confirmation" }
);

/* Crea los estados de turnos por defecto al instanciar la tabla.*/
Confirmation.sync()
  .then(() => {
    return Confirmation.count();
  })
  .then((count) => {
    if (count === 0) {
      const confirmationsToCreate = [
        { id: "pending" },
        { id: "confirmed" },
        { id: "cancelled" },
      ];
      return Confirmation.bulkCreate(confirmationsToCreate);
    }
    return Promise.resolve(); // No es necesario devolver nada si ya hay horaries
  })
  .then(() => {
    console.log("Default confirmations created successfully.");
  })
  .catch((error) => {
    console.error("Error:", error);
  });

module.exports = Confirmation;
