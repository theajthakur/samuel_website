const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("nodejs", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

async function syncDatabase() {
  try {
    // Sync all models
    await sequelize.sync({ force: false }); // `force: true` will drop the table if it exists and recreate it

    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing the database:", error);
  }
}

syncDatabase();

module.exports = sequelize;
