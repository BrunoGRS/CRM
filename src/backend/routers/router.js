import express from "express";
import { UsuarioRouter } from "./usuarioRouter.js";

export const expressRouter = express.Router();

const routerUsuario = UsuarioRouter;

expressRouter.use("/usuario", routerUsuario);