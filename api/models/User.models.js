const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const db = require("./db");
const Role = require("./Role.models");
const BranchOffice = require("./BranchOffice.models");

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
    full_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    role_id: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: Role,
        key: "id",
      },
    },
    branch_office_id: {
      type: Sequelize.INTEGER,
      references: {
        model: BranchOffice,
        key: "id",
      },
    },
    dni: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    token: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    confirmation: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  { sequelize: db, modelName: "user" }
);

User.beforeSave((user) => {
  const salt = bcrypt.genSaltSync();

  user.salt = salt;

  return user.hash(user.password, salt).then((hash) => {
    user.password = hash;
  });
});

module.exports = User;
