const Sequelize = require("sequelize");
const db = require("./db");

class Role extends Sequelize.Model {}

Role.init(
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
  },
  { sequelize: db, modelName: "role" }
);

/* Crea los roles por defecto al instanciar la tabla.*/
Role.sync()
  .then(() => {
    return Role.count();
  })
  .then((count) => {
    if (count === 0) {
      const rolesToCreate = [
        { id: "Administrador" },
        { id: "Super Administrador" },
        { id: "Operador" },
        { id: "Cliente" },
      ];
      return Role.bulkCreate(rolesToCreate);
    }
    return Promise.resolve(); // No es necesario devolver nada si ya hay roles
  })
  .then(() => {
    console.log("Default roles created successfully.");
  })
  .catch((error) => {
    console.error("Error:", error);
  });

module.exports = Role;
