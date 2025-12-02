import { DataTypes } from "sequelize";
import { db } from "../database/database.js";

const Manutencao = db.define(
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
      references: {
        model: "produto", // conforme seu SQL: REFERENCES produto(id)
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    tipo_manutencao: {
      type: DataTypes.ENUM("preventiva", "corretiva", "inspecao"),
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

    responsavel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuario", // conforme seu SQL: REFERENCES usuario(id)
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    custo_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },

    status: {
      type: DataTypes.ENUM("aberta", "em_execucao", "concluida", "cancelada"),
      allowNull: false,
      defaultValue: "aberta",
    },

    observacoes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "manutencoes",
    timestamps: true, // created_at / updated_at
    underscored: true, // usa snake_case (created_at) em vez de camelCase
  }
);

export default Manutencao;
