import express from "express";
import marcaController from "../controllers/marcaController.js";

export const MarcaRouter = express.Router();

MarcaRouter.route("/criar").post((req, res) =>
  marcaController.criarMarca(req, res)
);

MarcaRouter.route("/editar/:id").put((req, res) =>
  marcaController.editarMarca(req, res)
);

MarcaRouter.route("/listar").get((req, res) =>
  marcaController.listarMarcas(req, res)
);

MarcaRouter.route("/delete/:id").delete((req, res) =>
  marcaController.excluirMarca(req, res)
);