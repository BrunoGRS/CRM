import { db } from "../database/database.js";
import modelAlocacao from "../models/modelAlocacao.js";

async function criarAlocacao(req, res) {
  try {
    const alocacao = {
      maquina_id: req.body.maquina_id,
      cliente_id: req.body.cliente_id,
      data_inicio: req.body.data_inicio,
      data_fim: req.body.data_fim || null,
      status: req.body.status,
      local_instalacao: req.body.local_instalacao,
      responsavel_instalacao: req.body.responsavel_instalacao,
      observacoes: req.body.observacoes || null,
    };

    await modelAlocacao.sync();
    const result = await modelAlocacao.create(alocacao);

    result
      ? res.status(201).send({ msg: "Alocação criada com sucesso!" })
      : res.status(500).send({ msg: "Falha ao criar alocação." });
  } catch (error) {
    console.error("Erro ao criar alocação:", error);
    res.status(500).send({ msg: "Erro ao criar alocação." });
  }
}

async function listarAlocacoes(req, res) {
  try {
    const alocacoes = await modelAlocacao.findAll();
    res.status(200).send({ msg: alocacoes });
  } catch (error) {
    console.error("Erro ao listar alocações:", error);
    res.status(500).send({ msg: "Erro ao listar alocações." });
  }
}

async function editarAlocacao(req, res) {
  try {
    const alocacao = await modelAlocacao.findByPk(req.params.id);
    if (alocacao) {
      Object.assign(alocacao, req.body);
      await alocacao.save();
      res.status(200).send({ msg: "Alocação atualizada com sucesso!" });
    } else {
      res.status(404).send({ msg: "Alocação não encontrada." });
    }
  } catch (error) {
    console.error("Erro ao editar alocação:", error);
    res.status(500).send({ msg: "Erro ao editar alocação." });
  }
}

async function excluirAlocacao(req, res) {
  try {
    const alocacao = await modelAlocacao.findByPk(req.params.id);
    if (alocacao) {
      await alocacao.destroy();
      res.status(200).send({ msg: "Alocação excluída com sucesso!" });
    } else {
      res.status(404).send({ msg: "Alocação não encontrada." });
    }
  } catch (error) {
    console.error("Erro ao excluir alocação:", error);
    res.status(500).send({ msg: "Erro ao excluir alocação." });
  }
}

export default {
  criarAlocacao,
  listarAlocacoes,
  editarAlocacao,
  excluirAlocacao,
};
