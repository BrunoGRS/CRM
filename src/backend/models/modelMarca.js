import { Sequelize } from "sequelize";
import { db } from "../database/database.js";

export default db.define("marcas",{
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
},
{
    timestamps: false
})