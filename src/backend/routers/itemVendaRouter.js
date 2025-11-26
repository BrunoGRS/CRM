import express from "express";
import itemVendaController from "../controllers/itemVendaController.js";

export const ItemVendaRouter = express.Router();

// Criar itens da venda
ItemVendaRouter.route("/item-venda/criar").post((req, res) =>
  itemVendaController.salvarItensVenda(req, res)
);

// Listar itens de uma venda
ItemVendaRouter.route("/item-venda/listar/:venda_id").get((req, res) =>
  itemVendaController.listarItensVenda(req, res)
);

// Editar item específico
ItemVendaRouter.route("/item-venda/editar/:venda_id/:produto_id").put(
  (req, res) => itemVendaController.editarItemVenda(req, res)
);

// Excluir item da venda
ItemVendaRouter.route("/item-venda/delete/:id").delete((req, res) =>
  itemVendaController.excluirItemVenda(req, res)
);
