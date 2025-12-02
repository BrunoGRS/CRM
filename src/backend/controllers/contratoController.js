import Contrato from "../models/modelContrato.js";
import { QueryTypes } from "sequelize";
import { db } from "../database/database.js";

class ContratoController {
  // ==========================================================
  // CRIAR CONTRATO
  // ==========================================================
  async criarContrato(req, res) {
    const t = await db.transaction();
    try {
      const {
        cliente_id,
        empresa_id,
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

      const contrato = await Contrato.create(
        {
          cliente_id,
          empresa_id,
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
      return res
        .status(201)
        .json({ msg: "Contrato criado com sucesso", contrato_id: contrato.id });
    } catch (error) {
      console.error("❌ ERRO NO CONTROLLER CONTRATO:");
      console.error(error);
      await t.rollback();
      return res.status(500).json({ msg: "Erro ao criar contrato", error });
    }
  }

  // ==========================================================
  // LISTAR CONTRATOS
  // ==========================================================
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
          ct.valor_total,
          DATE_FORMAT(ct.data_inicio, "%d/%m/%Y") AS inicio,
          DATE_FORMAT(ct.data_fim, "%d/%m/%Y") AS fim,
          ct.status
        FROM contratos ct
        INNER JOIN cliente c ON c.id = ct.cliente_id
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

  // ==========================================================
  // VISUALIZAR CONTRATO ÚNICO
  // ==========================================================
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

  // ==========================================================
  // EDITAR CONTRATO
  // ==========================================================
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
        empresa_id,
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
          empresa_id,
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

  // ==========================================================
  // EXCLUIR CONTRATO
  // ==========================================================
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
