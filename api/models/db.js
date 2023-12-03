const { Sequelize } = require("sequelize");
const db = new Sequelize("turnoweb", "postgres", null, {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});
module.exports = db;
