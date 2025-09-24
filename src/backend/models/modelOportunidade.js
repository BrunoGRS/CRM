import { Sequelize } from "sequelize";
import { db } from "../database/database.js";

export default db.define(
  "oportunidades",
  {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    titulo: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    valor_estimado: {
      type: Sequelize.DECIMAL,
      allowNull: false,
    },
    etapa: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cliente_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    responsavel_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);
