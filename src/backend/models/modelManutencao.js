import { DataTypes } from "sequelize";
import { db } from "../database/database.js";

const modelManutencao = db.define(
  "manutencao",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    alocacao_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    data_manutencao: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM("preventiva", "corretiva"),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    custo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    tecnico_responsavel: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pendente", "em andamento", "finalizada"),
      allowNull: false,
      defaultValue: "pendente",
    },
  },
  {
    tableName: "manutencao",
    timestamps: true,
  }
);

export default modelManutencao;
