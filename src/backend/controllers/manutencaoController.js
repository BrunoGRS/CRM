import modelManutencao from "../models/modelManutencao.js";
import { db } from "../database/database.js";

async function criarManutencao(req, res) {
  try {
    const manutencao = {
      equipamento_id: req.body.equipamento_id,
      tipo_manutencao: req.body.tipo_manutencao,
      data_solicitacao: req.body.data_solicitacao,
      data_execucao: req.body.data_execucao || null,
      responsavel_id: req.body.responsavel_id,
      descricao: req.body.descricao,
      custo_total: req.body.custo_total || 0,
      status: req.body.status || "aberta",
      observacoes: req.body.observacoes || null,
    };

    const novaManutencao = await modelManutencao.create(manutencao);

    return res.status(201).send({
      msg: "Manutenção registrada com sucesso!",
      data: novaManutencao,
    });
  } catch (error) {
    console.error("Erro ao criar manutenção:", error);
    return res.status(500).send({ msg: "Erro ao criar manutenção." });
  }
}

async function listarManutencoes(req, res) {
  try {
    const manutencoes = await modelManutencao.findAll({
      order: [["created_at", "DESC"]],
    });

    return res.status(200).send({ msg: manutencoes });
  } catch (error) {
    console.error("Erro ao listar manutenções:", error);
    return res.status(500).send({ msg: "Erro ao listar manutenções." });
  }
}

async function listarManutencaoPorId(req, res) {
  try {
    const id = req.params.id;

    const manutencao = await modelManutencao.findByPk(id);

    if (!manutencao) {
      return res.status(404).send({ msg: "Manutenção não encontrada." });
    }

    return res.status(200).send({ msg: manutencao });
  } catch (error) {
    console.error("Erro ao buscar manutenção:", error);
    return res.status(500).send({ msg: "Erro ao buscar manutenção." });
  }
}

async function listarGeralManutencao(req, res) {
  try {
    const [manutencoes] = await db.query(`
      SELECT 
        m.id,
        p.nome AS maquina,
        m.tipo_manutencao,
        m.descricao,
        m.custo_total,
        u.nome,
        m.status as Status,
        m.data_execucao
      FROM manutencoes m
      INNER JOIN produto p ON p.id = m.equipamento_id
      INNER JOIN usuario u on u.id = m.responsavel_id
      ORDER BY m.id DESC;
    `);

    return res.status(200).json({ msg: manutencoes });
  } catch (error) {
    console.error("Erro ao listar manutenções:", error);
    return res.status(500).json({ error: "Erro ao listar manutenções" });
  }
}

async function editarManutencao(req, res) {
  try {
    const id = req.params.id;
    const manutencao = await modelManutencao.findByPk(id);

    if (!manutencao) {
      return res.status(404).send({ msg: "Manutenção não encontrada." });
    }

    await manutencao.update({
      equipamento_id: req.body.equipamento_id,
      tipo_manutencao: req.body.tipo_manutencao,
      data_solicitacao: req.body.data_solicitacao,
      data_execucao: req.body.data_execucao || null,
      responsavel_id: req.body.responsavel_id,
      descricao: req.body.descricao,
      custo_total: req.body.custo_total,
      status: req.body.status,
      observacoes: req.body.observacoes,
    });

    return res.status(200).send({ msg: "Manutenção atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro ao editar manutenção:", error);
    return res.status(500).send({ msg: "Erro ao editar manutenção." });
  }
}

async function excluirManutencao(req, res) {
  try {
    const id = req.params.id;
    const manutencao = await modelManutencao.findByPk(id);

    if (!manutencao) {
      return res.status(404).send({ msg: "Manutenção não encontrada." });
    }

    await manutencao.destroy();

    return res.status(200).send({ msg: "Manutenção excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir manutenção:", error);
    return res.status(500).send({ msg: "Erro ao excluir manutenção." });
  }
}

export default {
  criarManutencao,
  listarManutencoes,
  editarManutencao,
  excluirManutencao,
  listarGeralManutencao,
  listarManutencaoPorId,
};
