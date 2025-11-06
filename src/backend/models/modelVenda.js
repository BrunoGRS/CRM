import { Sequelize } from "sequelize";
import { db } from "../database/database.js";

const modelVenda = db.define(
  "vendas",
  {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    cliente_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    vendedor_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    data_venda: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    valor_total: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    observacao: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

export default modelVenda;
