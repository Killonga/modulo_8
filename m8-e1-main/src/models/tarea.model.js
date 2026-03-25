import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

/**
 * Tarea Model - Representa una tarea en el sistema
 * @typedef {import('sequelize').Model} TareaModel
 */
export const Tarea = sequelize.define(
  "Tarea",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "El título es obligatorio",
        },
        len: {
          args: [1, 255],
          msg: "El título debe tener entre 1 y 255 caracteres",
        },
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: "La descripción no puede exceder 1000 caracteres",
        },
      },
    },
    completada: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "completada",
    },
  },
  {
    tableName: "tareas",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "idx_tarea_completada",
        fields: ["completada"],
      },
    ],
  }
);

/**
 * Métodos estáticos del modelo Tarea
 */
Tarea.findAllTareas = async function (options = {}) {
  return this.findAll({
    attributes: ["id", "titulo", "descripcion", "completada"],
    ...options,
  });
};

Tarea.findTareaById = async function (id) {
  return this.findByPk(id);
};

Tarea.createTarea = async function (data) {
  return this.create(data);
};

Tarea.updateTarea = async function (id, data) {
  const tarea = await this.findByPk(id);
  if (!tarea) return null;
  return tarea.update(data);
};

Tarea.deleteTarea = async function (id) {
  const tarea = await this.findByPk(id);
  if (!tarea) return false;
  await tarea.destroy();
  return true;
};

export default Tarea;