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

/* Crea los roles por defecto al instanciar la tabla para no estar creandolos cada vez que se hacen las pruebas. Este método no debería incluirse al momento de hacer el deploy; en vez de eso hay que dejar creados los roles en la base de datos.*/
Role.sync()
  .then(() => {
    return Role.count();
  })
  .then((count) => {
    if (count === 0) {
      const rolesToCreate = [
        { id: "Administrador" },
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
