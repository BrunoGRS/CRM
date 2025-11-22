import { DataTypes } from "sequelize";
import { db } from "../database/database.js";

const Alocacao = db.define(
  "alocacoes",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    maquina_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    data_inicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    data_fim: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    local_instalacao: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    responsavel_instalacao: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "alocacoes",
  }
);

export default Alocacao;
