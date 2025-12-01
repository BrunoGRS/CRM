import express from "express";
import manutencaoController from "../controllers/manutencaoController.js";

export const ManutencaoRouter = express.Router();

// Criar manutenção
ManutencaoRouter.post("/criar", (req, res) =>
  manutencaoController.criarManutencao(req, res)
);

// Listar manutenções
ManutencaoRouter.get("/listar", (req, res) =>
  manutencaoController.listarManutencoes(req, res)
);

// Editar manutenção
ManutencaoRouter.put("/editar/:id", (req, res) =>
  manutencaoController.editarManutencao(req, res)
);

// Excluir manutenção
ManutencaoRouter.delete("/excluir/:id", (req, res) =>
  manutencaoController.excluirManutencao(req, res)
);
