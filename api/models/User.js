const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const db = require("./db");

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
    role: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    initialRole: {
      type: Sequelize.STRING,
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

User.beforeValidate((user) => {
  const salt = bcrypt.genSaltSync();

  user.salt = salt;

  return user.hash(user.password, salt).then((hash) => {
    user.password = hash;
  });
});
User.beforeCreate((user) => {
  return (user.initialRole = user.role);
});

module.exports = User;
