const Sequelize = require("sequelize");
const db = require("./db");

class ReasonCancellation extends Sequelize.Model {}

ReasonCancellation.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      unique: true,
    },
    reason: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { sequelize: db, modelName: "reason_cancellation" }
);

/* Crea las razones de cancelacióon por defecto al instanciar la tabla.*/
ReasonCancellation.sync()
  .then(() => {
    return ReasonCancellation.count();
  })
  .then((count) => {
    if (count === 0) {
      const reasonCancellationsToCreate = [
        { id: 1, reason: "Ya no quiero ir" },
        { id: 2, reason: "Me equivoqué de horario" },
        { id: 3, reason: "Encontré un lugar mejor" },
        { id: 4, reason: "Me cancelaron" },
        { id: 5, reason: "Otro" },
      ];
      return ReasonCancellation.bulkCreate(reasonCancellationsToCreate);
    }
    return Promise.resolve(); // No es necesario devolver nada si ya hay razones de cancelacióon
  })
  .then(() => {
    console.log("Default reason cancellations created successfully.");
  })
  .catch((error) => {
    console.error("Error:", error);
  });

module.exports = ReasonCancellation;
