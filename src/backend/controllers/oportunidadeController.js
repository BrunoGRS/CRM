import { toast } from "react-toastify";
import { db } from "../database/database.js";
import modelOportunidade from "../models/modelOportunidade.js";

async function criarOportunidade(req, res) {
  try {
    const oportunidade = {
      titulo: req.body.titulo,
      valor_estimado: req.body.valor_estimado,
      etapa: req.body.etapa,
      cliente_id: req.body.cliente_id,
      responsavel_id: req.body.titulo,
    };

    !modelOportunidade.sync().isPending ? await modelOportunidade.sync() : null;

    const result = await modelOportunidade.create(oportunidade);

    result
      ? res.status(201).send({ msg: "Oportunidade criado com sucesso" })
      : res.status(500).send({ msg: "Não foi possível criar a oportunidade" });
  } catch (error) {
    toast.error("Erro ao criar oportunidade");
    console.log(error);
  }
}

async function editarOportunidade(req, res) {
  try {
    let oportunidade = modelOportunidade.findByPk(id);

    if (oportunidade) {
      oportunidade
        .then((dado) => {
          (dado.tiutulo = dado.req.body),
            (dado.valor_estimado = dado.req.valor_estimado),
            (dado.etapa = dado.req.etapa),
            (dado.cliente_id = dado.req.cliente_id),
            (dado.responsavel_id = dado.req.responsavel_id);

          if (dado.save()) {
            res.status(200).send({
              msg: "Oportunidade Atualizada!",
            });
          }
        })
        .catch(() => {
          res.status(500).send({ msg: "Erro ao editar oportunidade" });
        });
    }
  } catch (error) {
    toast.error(error);
  }
}

async function mostrarOportunidades(req, res) {
  try {
    const oportunidades = modelOportunidade.findAll();

    oportunidades
      .then((dados) => {
        res.status(200).send({ msg: dados });
      })
      .catch(() => {
        res.status(500).send({ msg: "Erro ao editar oportunidade" });
      });
  } catch (error) {
    toast.error("Erro ao mostrar oportunidades", error);
  }
}

async function deletarOportunidade(params) {
  try {
    const oportunidade = modelOportunidade.findByPk(id);

    if (oportunidade) {
      oportunidade.then((dado) => {
        if (dado.destroy()) {
          res
            .status(200)
            .send({ msg: `oportunidade ${dado.nome} deletada com sucesso!` });
        }
      });
    }
  } catch (error) {
    toast.error("Erro ao deletar oportunidade", error);
  }
}
export default {
  criarOportunidade,
  editarOportunidade,
  mostrarOportunidades,
  deletarOportunidade,
};
