import express from "express";
import vendaController from "../controllers/vendaController.js";

export const VendaRouter = express.Router();

VendaRouter.post("/criar", (req, res) => vendaController.criarVenda(req, res));

VendaRouter.get("/listar", (req, res) =>
  vendaController.listarVendas(req, res)
);

VendaRouter.get("/:id", (req, res) =>
  vendaController.visualizarVenda(req, res)
);

VendaRouter.put("/editar/:id", (req, res) =>
  vendaController.editarVenda(req, res)
);

VendaRouter.delete("/:id", (req, res) =>
  vendaController.excluirVenda(req, res)
);
