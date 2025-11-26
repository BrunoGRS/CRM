import express from "express";
import vendaController from "../controllers/vendaController.js";

export const VendaRouter = express.Router();

// Criar venda completa
VendaRouter.post("/criar", (req, res) => vendaController.criarVenda(req, res));

// Listar vendas
VendaRouter.get("/listar", (req, res) =>
  vendaController.listarVendas(req, res)
);

VendaRouter.get("/listarGeral", (req, res) =>
  vendaController.visualizarVendaGeralCompleta(req, res)
);

// Visualizar venda + itens
VendaRouter.get("/:id", (req, res) =>
  vendaController.visualizarVenda(req, res)
);

VendaRouter.put("/editar/:id", (req, res) =>
  vendaController.editarVenda(req, res)
);

// Excluir venda + itens
VendaRouter.delete("/delete/:id", (req, res) =>
  vendaController.excluirVenda(req, res)
);
