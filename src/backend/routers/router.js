import express from "express";
import { UsuarioRouter } from "./usuarioRouter.js";
import { ProdutoRouter } from "./produtoRouter.js";
import { ClienteRouter } from "./clienteRouters.js";
import { ArquivoRouter } from "./arquivoRouter.js";
import { AlocacaoRouter } from "./alocacaoRouter.js";
import { ManutencaoRouter } from "./manutencaoRouter.js";
import { VendaRouter } from "./vendaRouter.js";
import { ItemVendaRouter } from "./itemVendaRouter.js";

export const expressRouter = express.Router();

const routerUsuario = UsuarioRouter;
const routerProduto = ProdutoRouter;
const routerCliente = ClienteRouter;
const routerArquivo = ArquivoRouter;
const routerAlocacao = AlocacaoRouter;
const routerManutencao = ManutencaoRouter;
const routerVenda = VendaRouter;
const routerItemVenda = ItemVendaRouter;

expressRouter.use("/usuario", routerUsuario);
expressRouter.use("/produto", routerProduto);
expressRouter.use("/cliente", routerCliente);
expressRouter.use("/arquivo", routerArquivo);
expressRouter.use("/alocacao", routerAlocacao);
expressRouter.use("/manutencao", routerManutencao);
expressRouter.use("/venda", routerVenda);
expressRouter.use("/item", routerItemVenda);
