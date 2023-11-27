const Sequelize = require("sequelize");
const db = require("./db");

class Horary extends Sequelize.Model {}

Horary.init(
  {
    id: {
      type: Sequelize.TIME,
      primaryKey: true,
      unique: true,
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
    const horariesToCreate = [];
    if (count === 0) {
      for (let i = 7; i <= 21; i++) {
        for (let j = 0; j <= 45; i += 15) {
          horariesToCreate.push({
            id: `${i < 10 ? `0${i}` : i}:${(j = 0 ? `00` : j)}:00`,
          });
        }
      }
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
