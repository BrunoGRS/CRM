import { db } from "../database/database.js";
import modelArquivo from "../models/modelArquivo.js";
import fs from "fs";
import path from "path";

async function criarArquivo(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "Nenhum arquivo enviado." });
    }

    const { originalname, mimetype, size, buffer } = req.file;

    const novoArquivo = await modelArquivo.create({
      nome: originalname,
      tipo: mimetype,
      tamanho: size,
      dados: buffer,
    });

    res.status(201).json({
      msg: "Arquivo salvo com sucesso!",
      arquivo: {
        id: novoArquivo.id,
        nome: novoArquivo.nome,
        tipo: novoArquivo.tipo,
        tamanho: novoArquivo.tamanho,
      },
    });
  } catch (error) {
    console.error("Erro ao criar arquivo:", error);
    res.status(500).json({ msg: "Erro ao criar arquivo" });
  }
}

async function mostrarArquivos(req, res) {
  try {
    const arquivos = await modelArquivo.findAll({
      attributes: ["id", "nome", "tipo", "criado_em"],
    });

    if (arquivos.length > 0) {
      res.status(200).send({ msg: arquivos });
    } else {
      res.status(404).send({ msg: false });
    }
  } catch (error) {
    console.error("Erro ao listar arquivos:", error);
    res.status(500).send({ msg: `Erro: ${error}` });
  }
}

async function visualizarArquivo(req, res) {
  try {
    const arquivo = await modelArquivo.findByPk(req.params.id);

    if (!arquivo) {
      return res.status(404).send({ msg: "Arquivo não encontrado" });
    }

    res.setHeader("Content-Type", arquivo.tipo_arquivo);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${arquivo.nome_arquivo}"`
    );
    res.send(arquivo.arquivo);
  } catch (error) {
    console.error("Erro ao visualizar arquivo:", error);
    res.status(500).send({ msg: `Erro: ${error}` });
  }
}

async function deleteArquivo(req, res) {
  try {
    const arquivo = await modelArquivo.findByPk(req.params.id);

    if (arquivo) {
      await arquivo.destroy();
      res.status(200).send({
        msg: `Arquivo ${arquivo.nome_arquivo} deletado com sucesso!`,
      });
    } else {
      res.status(404).send({ msg: "Arquivo não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao deletar arquivo:", error);
    res.status(500).send({ msg: `Erro: ${error}` });
  }
}

export default {
  criarArquivo,
  mostrarArquivos,
  visualizarArquivo,
  deleteArquivo,
};
