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

/* Crea los horarios por defecto al instanciar la tabla.*/
Horary.sync()
  .then(() => {
    return Horary.count();
  })
  .then((count) => {
    if (count === 0) {
      const horariesToCreate = [
        { id: "10:15:00" },
        { id: "10:30:00" },
        { id: "11:00:00" },
        { id: "19:00:00" },
      ];
      return Horary.bulkCreate(horariesToCreate);
    }
    return Promise.resolve(); // No es necesario devolver nada si ya hay horaries
  })
  .then(() => {
    console.log("Default horaries created successfully.");
  })
  .catch((error) => {
    console.error("Error:", error);
  });

module.exports = Horary;
