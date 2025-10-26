import express from "express";
import produtoController from "../controllers/produtoController.js";

export const ProdutoRouter = express.Router();

ProdutoRouter.route("/criar").post((req, res) =>
  produtoController.criarProduto(req, res)
);

ProdutoRouter.route("/editar/:id").put((req, res) =>
  produtoController.editarProduto(req, res)
);

ProdutoRouter.route("/listar").get((req, res) =>
  produtoController.listarProdutos(req, res)
);

ProdutoRouter.route("/delete/:id").delete((req, res) =>
  produtoController.deletarProduto(req, res)
);
