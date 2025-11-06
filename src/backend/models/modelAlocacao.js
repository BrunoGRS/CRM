import { DataTypes } from "sequelize";
import { db } from "../database/database.js";

const modelAlocacao = db.define(
  "alocacao",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    produto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantidade: {
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
    valor_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("ativa", "encerrada", "pendente"),
      allowNull: false,
      defaultValue: "ativa",
    },
    observacao: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "alocacao",
    timestamps: true,
  }
);

export default modelAlocacao;
