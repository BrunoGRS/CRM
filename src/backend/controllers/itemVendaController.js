import Venda from "../models/modelVenda.js";
import ItemVenda from "../models/modelItemVenda.js";
import Produto from "../models/modelProduto.js";
import { db } from "../database/database.js";

class VendaController {
  // ==========================================================
  // CRIAR VENDA
  // ==========================================================
  async criarVenda(req, res) {
    const t = await db.transaction();
    try {
      const { cliente_id, data_venda, status, itens } = req.body;

      const venda = await Venda.create(
        { cliente_id, data_venda, status },
        { transaction: t }
      );

      for (const item of itens) {
        const produto = await Produto.findByPk(item.produto_id);

        if (!produto) {
          await t.rollback();
          return res.status(400).json({ msg: "Produto não encontrado" });
        }

        const subtotal = Number(item.quantidade) * Number(item.valor_unitario);

        await ItemVenda.create(
          {
            venda_id: venda.id,
            produto_id: item.produto_id,
            quantidade: item.quantidade,
            valor_unitario: item.valor_unitario,
            subtotal,
          },
          { transaction: t }
        );
      }

      await t.commit();
      return res.json({ msg: "Venda criada com sucesso", venda_id: venda.id });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({ msg: "Erro ao criar venda", error });
    }
  }

  // ==========================================================
  // LISTAR TODAS VENDAS
  // ==========================================================
  async listarVendas(req, res) {
    try {
      const vendas = await Venda.findAll({
        include: [
          {
            model: ItemVenda,
            include: [{ model: Produto }],
          },
        ],
      });

      return res.json(vendas);
    } catch (error) {
      return res.status(500).json({ msg: "Erro ao listar vendas", error });
    }
  }

  // ==========================================================
  // VISUALIZAR VENDA ÚNICA
  // ==========================================================
  async visualizarVenda(req, res) {
    try {
      const { id } = req.params;

      const venda = await Venda.findByPk(id, {
        include: [
          {
            model: ItemVenda,
            include: [{ model: Produto }],
          },
        ],
      });

      if (!venda) {
        return res.status(404).json({ msg: "Venda não encontrada" });
      }

      return res.json(venda);
    } catch (error) {
      return res.status(500).json({ msg: "Erro ao visualizar venda", error });
    }
  }

  // ==========================================================
  // EDITAR VENDA + ITENS (UNIFICADO)
  // ==========================================================
  async editarVenda(req, res) {
    const t = await db.transaction();
    try {
      const { id } = req.params;
      const { cliente_id, data_venda, status, itens } = req.body;

      const venda = await Venda.findByPk(id);

      if (!venda) {
        await t.rollback();
        return res.status(404).json({ msg: "Venda não encontrada" });
      }

      // Atualiza info da venda (SEM subtotal)
      await venda.update(
        { cliente_id, data_venda, status },
        { transaction: t }
      );

      // ================================
      // ITENS EXISTENTES NO BANCO
      // ================================
      const itensExistentes = await ItemVenda.findAll({
        where: { venda_id: id },
        transaction: t,
      });

      const idsRecebidos = itens.map((i) => i.id).filter((id) => id !== null);

      // REMOVER os que não vieram na requisição
      for (const itemDb of itensExistentes) {
        if (!idsRecebidos.includes(itemDb.id)) {
          await itemDb.destroy({ transaction: t });
        }
      }

      // ================================
      // ATUALIZAR OU CRIAR ITENS
      // ================================
      for (const item of itens) {
        const subtotal = Number(item.quantidade) * Number(item.valor_unitario);

        if (item.id) {
          // Atualiza item existente
          await ItemVenda.update(
            {
              quantidade: item.quantidade,
              valor_unitario: item.valor_unitario,
              subtotal,
            },
            {
              where: { id: item.id, venda_id: id },
              transaction: t,
            }
          );
        } else {
          // Cria novo item
          await ItemVenda.create(
            {
              venda_id: id,
              produto_id: item.produto_id,
              quantidade: item.quantidade,
              valor_unitario: item.valor_unitario,
              subtotal,
            },
            { transaction: t }
          );
        }
      }

      await t.commit();
      return res.json({ msg: "Venda atualizada com sucesso" });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({ msg: "Erro ao editar venda", error });
    }
  }

  // ==========================================================
  // EXCLUIR VENDA + ITENS
  // ==========================================================
  async excluirVenda(req, res) {
    const { id } = req.params;

    const t = await db.transaction();
    try {
      const venda = await Venda.findByPk(id);

      if (!venda) {
        await t.rollback();
        return res.status(404).json({ msg: "Venda não encontrada" });
      }

      // Exclui itens
      await ItemVenda.destroy({
        where: { venda_id: id },
        transaction: t,
      });

      // Exclui venda
      await venda.destroy({ transaction: t });

      await t.commit();
      return res.json({ msg: "Venda removida com sucesso" });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({ msg: "Erro ao excluir venda", error });
    }
  }
}

export default new VendaController();
