import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

export const Usuario = sequelize.define(
  "usuarios",
  {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false },
);
