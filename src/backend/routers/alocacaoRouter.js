import express from "express";
import alocacaoController from "../controllers/alocacaoController.js";

export const AlocacaoRouter = express.Router();

AlocacaoRouter.get("/listar", (req, res) =>
  alocacaoController.listar(req, res)
);

AlocacaoRouter.get("/buscar/:id", (req, res) =>
  alocacaoController.buscarPorId(req, res)
);

AlocacaoRouter.post("/criar", (req, res) => alocacaoController.criar(req, res));

AlocacaoRouter.put("/editar/:id", (req, res) =>
  alocacaoController.editar(req, res)
);
AlocacaoRouter.delete("/deletar/:id", (req, res) =>
  alocacaoController.deletar(req, res)
);
