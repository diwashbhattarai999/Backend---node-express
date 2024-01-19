const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "Diwash@4477", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
