import express from "express";
import alocacaoController from "../controllers/alocacaoController.js";

export const AlocacaoRouter = express.Router();

AlocacaoRouter.post("/criar", (req, res) =>
  alocacaoController.criarAlocacao(req, res)
);

AlocacaoRouter.get("/listar", (req, res) =>
  alocacaoController.listarAlocacoes(req, res)
);

AlocacaoRouter.put("/editar/:id", (req, res) =>
  alocacaoController.editarAlocacao(req, res)
);

AlocacaoRouter.delete("/:id", (req, res) =>
  alocacaoController.excluirAlocacao(req, res)
);
