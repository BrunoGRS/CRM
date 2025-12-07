import express from "express";
import clienteController from "../controllers/clienteController.js";

export const ClienteRouter = express.Router();

ClienteRouter.route("/criar").post((req, res) =>
  clienteController.criarCliente(req, res)
);

ClienteRouter.route("/editar/:id").put((req, res) =>
  clienteController.editarCliente(req, res)
);

ClienteRouter.route("/listar").get((req, res) =>
  clienteController.mostrarCliente(req, res)
);

ClienteRouter.route("/listar").get((req, res) =>
  clienteController.mostrarCliente(req, res)
);

ClienteRouter.route("/delete/:id").delete((req, res) =>
  clienteController.deleteCliente(req, res)
);
