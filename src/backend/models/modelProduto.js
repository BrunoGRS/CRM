import { Sequelize } from "sequelize";
import { db } from "../database/database.js";

export default db.define("produtos",{
    
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
    imagem_url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    preco: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    estoque: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    status_estoque: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    categoria_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    marca_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
},{
    timestamps: false
})