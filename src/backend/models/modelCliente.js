import { db } from "../database/database.js";
import { Sequelize } from "sequelize";

export default db.define(
  "cliente",
  {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nome_contato: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    fantasiaEmpresa: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    razaoSocialEmpresa: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    telefone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    cidade: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    bairro: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    ruaEndereco: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    numeroEndereco: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    complemento: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    cnpj_cpf: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);
