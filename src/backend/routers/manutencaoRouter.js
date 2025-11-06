import express from "express";
import manutencaoController from "../controllers/manutencaoController.js";

export const ManutencaoRouter = express.Router();

ManutencaoRouter.post("/criar", (req, res) =>
  manutencaoController.criarManutencao(req, res)
);

ManutencaoRouter.get("/listar", (req, res) =>
  manutencaoController.listarManutencoes(req, res)
);

ManutencaoRouter.put("/editar/:id", (req, res) =>
  manutencaoController.editarManutencao(req, res)
);

ManutencaoRouter.delete("/:id", (req, res) =>
  manutencaoController.excluirManutencao(req, res)
);
