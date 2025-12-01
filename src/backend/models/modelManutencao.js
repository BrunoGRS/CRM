import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Manutencao = sequelize.define(
  "manutencoes",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    equipamento_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    tipo_manutencao: {
      type: DataTypes.ENUM("Preventiva", "Corretiva", "Urgente"),
      allowNull: false,
    },

    data_solicitacao: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    data_execucao: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    tecnico_responsavel: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },

    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    custo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
    },

    status: {
      type: DataTypes.ENUM("Pendente", "Em execução", "Concluída"),
      allowNull: false,
      defaultValue: "Pendente",
    },

    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true, // createdAt e updatedAt
    tableName: "manutencoes",
  }
);

export default Manutencao;
