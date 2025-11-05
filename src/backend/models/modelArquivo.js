import { Sequelize } from "sequelize";
import { db } from "../database/database.js";

export default db.define(
  "arquivos",
  {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nome: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tipo: {
      type: Sequelize.STRING,
      allowNull: false, // Ex: 'image/png', 'application/pdf'
    },
    tamanho: {
      type: Sequelize.INTEGER,
      allowNull: false, // Tamanho do arquivo em bytes
    },
    dados: {
      type: Sequelize.BLOB("long"), // LONG BLOB para armazenar o conteúdo
      allowNull: false,
    },
    criado_em: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    timestamps: false,
  }
);
