import express from "express";
import oportunidadeController from "../controllers/oportunidadeController.js";

export const oportunidadeRouter = express.Router();

oportunidadeRouter
  .route("/criar")
  .post((req, res) => oportunidadeController.criarOportunidade(req, res));
