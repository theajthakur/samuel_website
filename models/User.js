const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../service/database");

// Define the User model
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
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
      allowNull: false,
      defaultValue: "NORMAL",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parent: {
      type: DataTypes.INTEGER,
      references: {
        model: "Admins",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = User;
