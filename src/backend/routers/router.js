import express from "express";
import { UsuarioRouter } from "./usuarioRouter.js";
import { CategoriaRouter } from "./categoriaRouter.js";
import { MarcaRouter } from "./marcaRouter.js";
import { ProdutoRouter } from "./produtoRouter.js";
import { ClienteRouter } from "./clienteRouters.js";
import { oportunidadeRouter } from "./oportunidadeRouter.js";
import { ArquivoRouter } from "./arquivoRouter.js";
import { AlocacaoRouter } from "./alocacaoRouter.js";

export const expressRouter = express.Router();

const routerUsuario = UsuarioRouter;
const routerCategoria = CategoriaRouter;
const routerMarca = MarcaRouter;
const routerProduto = ProdutoRouter;
const routerCliente = ClienteRouter;
const routerOportunidade = oportunidadeRouter;
const routerArquivo = ArquivoRouter;

expressRouter.use("/usuario", routerUsuario);
expressRouter.use("/categoria", routerCategoria);
expressRouter.use("/marca", routerMarca);
expressRouter.use("/produto", routerProduto);
expressRouter.use("/cliente", routerCliente);
expressRouter.use("/oportunidade", routerOportunidade);
expressRouter.use("/arquivo", routerArquivo);
