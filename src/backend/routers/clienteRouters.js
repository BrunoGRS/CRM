import express from "express";
import clienteController from "../controllers/clienteController.js";

export const ClienteRouter = express.Router();

ClienteRouter.route("/criar").post((req, res) =>
  clienteController.criarCliente(req, res)
);
