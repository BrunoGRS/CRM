import modelManutencao from "../models/modelManutencao.js";

async function criarManutencao(req, res) {
  try {
    const manutencao = {
      alocacao_id: req.body.alocacao_id,
      data_manutencao: req.body.data_manutencao,
      tipo: req.body.tipo,
      descricao: req.body.descricao,
      custo: req.body.custo || 0,
      tecnico_responsavel: req.body.tecnico_responsavel,
      status: req.body.status || "pendente",
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
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).send({ manutencoes });
  } catch (error) {
    console.error("Erro ao listar manutenções:", error);
    return res.status(500).send({ msg: "Erro ao listar manutenções." });
  }
}

async function editarManutencao(req, res) {
  try {
    const id = req.params.id;
    const manutencao = await modelManutencao.findByPk(id);

    if (!manutencao) {
      return res.status(404).send({ msg: "Manutenção não encontrada." });
    }

    await manutencao.update(req.body);

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
};
