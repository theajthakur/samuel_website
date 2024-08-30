const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../service/database");

const Admin = sequelize.define(
  "Admin",
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
      type: DataTypes.ENUM("loweradmin", "superadmin"),
      allowNull: false,
      defaultValue: "loweradmin",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parent: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    primaryColor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "rgb(255, 182, 59)",
    },
    secondaryColor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "rgb(2, 26, 54)",
    },
    backgroundColor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "rgb(2, 26, 54)",
    },
    logoName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "logo.png",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Admin;
