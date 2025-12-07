import Contrato from "../models/modelContrato.js";
import { QueryTypes } from "sequelize";
import { db } from "../database/database.js";
import modelContrato from "../models/modelContrato.js";

class ContratoController {
  async criarContrato(req, res) {
    const t = await db.transaction();
    try {
      const contrato = {
        cliente_id: req.body.cliente_id,
        usuario_responsavel_id: req.body.usuario_responsavel_id,
        numero_contrato: req.body.numero_contrato,
        titulo: req.body.titulo,
        tipo_contrato: req.body.tipo_contrato,
        descricao: req.body.descricao || null,
        data_assinatura: req.body.data_assinatura,
        data_inicio: req.body.data_inicio,
        data_fim: req.body.data_fim || null,
        valor_total: req.body.valor_total,
        valor_mensal: req.body.valor_mensal || null,
        forma_pagamento: req.body.forma_pagamento || null,
        status: req.body.status,
      };

      const novoContrato = await modelContrato.create(contrato);

      return res.status(201).send({
        msg: "Contrato registrado com sucesso!",
        data: novoContrato,
      });
    } catch (error) {
      console.error("❌ ERRO NO CONTROLLER CONTRATO:");
      console.error(error);
      return res.status(500).json({ msg: "Erro ao criar contrato", error });
    }
  }

  async listarContratos(req, res) {
    try {
      const contratos = await db.query(
        `
        SELECT 
          ct.id,
          c.razaoSocialEmpresa AS cliente,
          ct.numero_contrato,
          ct.titulo,
          ct.tipo_contrato,
          ct.data_assinatura,
          u.nome,
          ct.valor_mensal,
          DATE_FORMAT(ct.data_inicio, "%d/%m/%Y") AS inicio,
          DATE_FORMAT(ct.data_fim, "%d/%m/%Y") AS fim,
          ct.valor_total,
          ct.status
        FROM contratos ct
        INNER JOIN cliente c ON c.id = ct.cliente_id
        INNER JOIN usuario u ON u.id = ct.usuario_responsavel_id
        ORDER BY ct.id DESC
        `,
        { type: QueryTypes.SELECT }
      );

      return res.json({ msg: contratos });
    } catch (error) {
      console.error("❌ ERRO AO LISTAR CONTRATOS:", error);
      return res.status(500).json({ msg: "Erro ao listar contratos", error });
    }
  }

  async visualizarContrato(req, res) {
    try {
      const { id } = req.params;

      const contrato = await Contrato.findByPk(id);

      if (!contrato) {
        return res.status(404).json({ msg: "Contrato não encontrado" });
      }

      return res.json({ msg: contrato });
    } catch (error) {
      console.error("❌ ERRO AO VISUALIZAR CONTRATO:", error);
      return res.status(500).json({
        msg: "Erro ao visualizar contrato",
        error: error.message,
      });
    }
  }

  async editarContrato(req, res) {
    const t = await db.transaction();
    try {
      const { id } = req.params;

      const contrato = await Contrato.findByPk(id);

      if (!contrato) {
        await t.rollback();
        return res.status(404).json({ msg: "Contrato não encontrado" });
      }

      const {
        cliente_id,
        usuario_responsavel_id,
        numero_contrato,
        titulo,
        tipo_contrato,
        descricao,
        data_assinatura,
        data_inicio,
        data_fim,
        valor_total,
        valor_mensal,
        forma_pagamento,
        status,
      } = req.body;

      await contrato.update(
        {
          cliente_id,
          usuario_responsavel_id,
          numero_contrato,
          titulo,
          tipo_contrato,
          descricao,
          data_assinatura,
          data_inicio,
          data_fim,
          valor_total,
          valor_mensal,
          forma_pagamento,
          status,
        },
        { transaction: t }
      );

      await t.commit();
      return res.json({ msg: "Contrato atualizado com sucesso" });
    } catch (error) {
      console.error("❌ ERRO AO EDITAR CONTRATO:", error);
      await t.rollback();
      return res.status(500).json({ msg: "Erro ao editar contrato", error });
    }
  }

  async excluirContrato(req, res) {
    const t = await db.transaction();
    try {
      const { id } = req.params;

      const contrato = await Contrato.findByPk(id);

      if (!contrato) {
        await t.rollback();
        return res.status(404).json({ msg: "Contrato não encontrado" });
      }

      await contrato.destroy({ transaction: t });

      await t.commit();
      return res.json({ msg: "Contrato excluído com sucesso" });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({ msg: "Erro ao excluir contrato", error });
    }
  }
}

export default new ContratoController();
