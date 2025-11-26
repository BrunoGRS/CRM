import { DataTypes } from "sequelize";
import { db } from "../database/database.js";
// 1. IMPORTANTE: Importe o model de Produto para fazer a ligação
import modelProduto from "./modelProduto.js";
// import modelVenda from "./Venda.js"; // Cuidado com importação circular aqui!

const modelItemVenda = db.define(
  "item_venda",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    venda_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    produto_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantidade: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    valor_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    tableName: "item_venda",
    timestamps: false,
  }
);

modelItemVenda.belongsTo(modelProduto, {
  foreignKey: "produto_id",
  as: "produto",
});

export default modelItemVenda;
