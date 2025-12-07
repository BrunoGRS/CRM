import { Sequelize } from "sequelize";
import { db } from "../database/database.js";

const modelContrato = db.define(
  "contratos",
  {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    // RELACIONAMENTOS
    cliente_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    usuario_responsavel_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    // DADOS DO CONTRATO
    numero_contrato: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
    },
    titulo: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    tipo_contrato: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    descricao: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    // DATAS
    data_assinatura: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    data_inicio: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    data_fim: {
      type: Sequelize.DATE,
      allowNull: true,
    },

    // FINANCEIRO
    valor_total: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: false,
    },
    valor_mensal: {
      type: Sequelize.DECIMAL(12, 2),
      allowNull: true,
    },
    forma_pagamento: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },

    // STATUS
    status: {
      type: Sequelize.STRING(50),
      defaultValue: "ATIVO",
    },

    // ARQUIVO ANEXADO
    arquivo_nome: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    arquivo_tipo: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    arquivo_tamanho: {
      type: Sequelize.BIGINT,
      allowNull: true,
    },
    arquivo_url: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "contratos",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default modelContrato;
