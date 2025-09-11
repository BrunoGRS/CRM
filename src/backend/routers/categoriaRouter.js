import express from "express";
import categoriaController from "../controllers/categoriaController.js";

export const CategoriaRouter = express.Router();

CategoriaRouter.route("/criar").post((req, res) =>
  categoriaController.criarCategoria(req, res)
);

CategoriaRouter.route("/editar/:id").put((req, res) =>
  categoriaController.editarCaregoria(req, res)
);

CategoriaRouter.route("/listar").get((req, res) =>
  categoriaController.listarCategorias(req, res)
);

CategoriaRouter.route("/delete/:id").delete((req, res) =>
  categoriaController.excluirCategoria(req, res)
);