import express from "express";
import produtoController from "../controllers/produtoController.js";

export const ProdutoRouter = express.Router();

ProdutoRouter.route("/criar").post((req, res) =>
  produtoController.criarProduto(req, res)
);
