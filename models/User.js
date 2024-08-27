const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../service/database"); // Adjust the path to your Sequelize instance

// Define the User model
const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false, // Required field
      defaultValue: "NORMAL", // Default value
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Required field
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

// Export the model
module.exports = User;
