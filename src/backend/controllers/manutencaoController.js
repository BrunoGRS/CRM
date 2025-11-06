import { db } from "../database/database.js";
import modelManutencao from "../models/modelManutencao.js";

async function criarManutencao(req, res) {
  try {
    const manutencao = {
      equipamento_id: req.body.equipamento_id,
      tipo_manutencao: req.body.tipo_manutencao,
      data_solicitacao: req.body.data_solicitacao,
      data_execucao: req.body.data_execucao || null,
      responsavel: req.body.responsavel,
      descricao: req.body.descricao,
      custo: req.body.custo || 0,
      status: req.body.status,
      observacoes: req.body.observacoes || null,
    };

    await modelManutencao.sync();
    const result = await modelManutencao.create(manutencao);

    result
      ? res.status(201).send({ msg: "Manutenção registrada com sucesso!" })
      : res.status(500).send({ msg: "Falha ao registrar manutenção." });
  } catch (error) {
    console.error("Erro ao criar manutenção:", error);
    res.status(500).send({ msg: "Erro ao criar manutenção." });
  }
}

async function listarManutencoes(req, res) {
  try {
    const manutencoes = await modelManutencao.findAll();
    res.status(200).send({ msg: manutencoes });
  } catch (error) {
    console.error("Erro ao listar manutenções:", error);
    res.status(500).send({ msg: "Erro ao listar manutenções." });
  }
}

async function editarManutencao(req, res) {
  try {
    const manutencao = await modelManutencao.findByPk(req.params.id);
    if (manutencao) {
      Object.assign(manutencao, req.body);
      await manutencao.save();
      res.status(200).send({ msg: "Manutenção atualizada com sucesso!" });
    } else {
      res.status(404).send({ msg: "Manutenção não encontrada." });
    }
  } catch (error) {
    console.error("Erro ao editar manutenção:", error);
    res.status(500).send({ msg: "Erro ao editar manutenção." });
  }
}

async function excluirManutencao(req, res) {
  try {
    const manutencao = await modelManutencao.findByPk(req.params.id);
    if (manutencao) {
      await manutencao.destroy();
      res.status(200).send({ msg: "Manutenção excluída com sucesso!" });
    } else {
      res.status(404).send({ msg: "Manutenção não encontrada." });
    }
  } catch (error) {
    console.error("Erro ao excluir manutenção:", error);
    res.status(500).send({ msg: "Erro ao excluir manutenção." });
  }
}

export default {
  criarManutencao,
  listarManutencoes,
  editarManutencao,
  excluirManutencao,
};
