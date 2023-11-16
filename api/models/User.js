const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const db = require("./db");
const Role = require("./Role");

class User extends Sequelize.Model {
  hash(password, salt) {
    return bcrypt.hash(password, salt);
  }

  validatePassword(password) {
    return this.hash(password, this.salt).then(
      (newHash) => newHash === this.password
    );
  }
}

User.init(
  {
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    salt: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    fullName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    roleId: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: Role,
        key: "id",
      },
    },
    initialRoleId: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: Role,
        key: "id",
      },
    },
    dni: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    token: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  { sequelize: db, modelName: "user" }
);

User.beforeCreate((user) => {
  const salt = bcrypt.genSaltSync();

  user.salt = salt;

  return user.hash(user.password, salt).then((hash) => {
    user.password = hash;
  });
});
/* User.beforeCreate((user) => {
  return (user.initialRole = user.role);
}); */

module.exports = User;
