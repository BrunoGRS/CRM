import express from "express";
import { main } from "./database/database.js";
import { expressRouter } from "./routers/router.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors());

const connectionDb = main();

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

const routerUsuario = expressRouter;

app.use("/api", routerUsuario);

app.listen(3000, () => {
  console.log("Servidor rodando em <http://localhost:3000>");
});
