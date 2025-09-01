import { Sequelize } from "sequelize";
import dotenv from "dotenv"

dotenv.config({ path: "../backend/.env" }); //especifica o caminho do .env

const dbName = process.env.DB_NAME; // passar os dados do .env para as constantes
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbPassword = process.env.DB_PASSWORD;

export const db = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: "mysql",
  define: {
    freezeTableName: true,
  },
});

export async function main() {
  try {
    await db.authenticate();
    console.log("Conexão Estabelecida");
  } catch (error) {
    console.log("Erro: ", error);
  }
}