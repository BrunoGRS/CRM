import express from "express";
import contratoController from "../controllers/contratoController.js";

export const ContratoRouter = express.Router();

// Criar contrato completo
ContratoRouter.post("/criar", (req, res) =>
  contratoController.criarContrato(req, res)
);

// Listar contratos
ContratoRouter.get("/listar", (req, res) =>
  contratoController.listarContratos(req, res)
);

// Visualizar contrato + itens
ContratoRouter.get("/:id", (req, res) =>
  contratoController.visualizarContrato(req, res)
);

// Editar contrato
ContratoRouter.put("/editar/:id", (req, res) =>
  contratoController.editarContrato(req, res)
);

// Excluir contrato + itens associados
ContratoRouter.delete("/delete/:id", (req, res) =>
  contratoController.excluirContrato(req, res)
);
