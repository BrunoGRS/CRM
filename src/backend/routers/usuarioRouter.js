import express from "express";
import usuarioController from "../controllers/usuarioController.js";

export const UsuarioRouter = express.Router();

UsuarioRouter.route("/criar").post((req, res) =>
  usuarioController.criarUser(req, res)
);

UsuarioRouter.route("/delete/:id").delete((req, res) => {
  usuarioController.deleteUser(req, res);
});

UsuarioRouter.route("/listar").get((req, res) => {
  usuarioController.mostrarUser(req, res);
});

UsuarioRouter.route("/editar/:id").put((req, res) => {
  usuarioController.editarUser(req, res);
});

UsuarioRouter.route("/validar").post((req, res) => {
  usuarioController.validarUser(req, res);
});

UsuarioRouter.route("/forgot-password").post((req, res) => {
  usuarioController.forgotPassword(req, res);
});
