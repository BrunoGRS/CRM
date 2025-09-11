import express from "express";
import { UsuarioRouter } from "./usuarioRouter.js";
import { CategoriaRouter } from "./categoriaRouter.js";
import { MarcaRouter } from "./marcaRouter.js";
import { ProdutoRouter } from "./produtoRouter.js";

export const expressRouter = express.Router();

const routerUsuario = UsuarioRouter;
const routerCategoria = CategoriaRouter;
const routerMarca = MarcaRouter;
const routerProduto = ProdutoRouter;

expressRouter.use("/usuario", routerUsuario);
expressRouter.use("/categoria", routerCategoria);
expressRouter.use("/marca", routerMarca);
expressRouter.use("/produto", routerProduto);
