const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("nodejs", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

async function syncDatabase() {
  try {
    await sequelize.sync({ force: false });
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing the database:", error);
  }
}

syncDatabase();

module.exports = sequelize;
