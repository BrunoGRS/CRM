import { Sequelize } from "sequelize";
import { db } from "../database/database.js";
// 1. IMPORTANTE: Você precisa importar o model com quem quer se relacionar
import modelItemVenda from "./modelItemVenda.js";

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
      allowNull: true,
    },
    data_venda: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    valor_total: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    },
    observacao: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "vendas", // É boa prática garantir o nome da tabela
  }
);

// --- 2. ADICIONE O RELACIONAMENTO AQUI ---

// Uma Venda TEM MUITOS Itens
modelVenda.hasMany(modelItemVenda, {
  foreignKey: "venda_id",
  as: "itens",
});

// Opcional: Se quiser que o item "volte" para venda
// modelItemVenda.belongsTo(modelVenda, { foreignKey: 'venda_id' });

export default modelVenda;
