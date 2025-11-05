import express from "express";
import arquivoController from "../controllers/arquivoController.js";
import multer from "multer";

export const ArquivoRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

ArquivoRouter.post("/upload", upload.single("arquivo"), (req, res) =>
  arquivoController.criarArquivo(req, res)
);

ArquivoRouter.get("/listar", (req, res) =>
  arquivoController.mostrarArquivos(req, res)
);

ArquivoRouter.get("/:id", (req, res) =>
  arquivoController.visualizarArquivo(req, res)
);

ArquivoRouter.delete("/:id", (req, res) =>
  arquivoController.excluirArquivo(req, res)
);
