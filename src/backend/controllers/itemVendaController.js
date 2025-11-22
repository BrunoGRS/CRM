import modelItemVenda from "../models/modelItemVenda.js";
import modelVenda from "../models/modelVenda.js";
import { db } from "../database/database.js";

// Atualiza o total automaticamente conforme os itens
async function atualizarTotalVenda(venda_id) {
  const [resultado] = await db.query(
    `SELECT SUM(subtotal) AS total FROM item_venda WHERE venda_id = ?`,
    { replacements: [venda_id] }
  );

  const total = resultado[0].total || 0;

  await modelVenda.update({ valor_total: total }, { where: { id: venda_id } });
}

/// Criar item(s) da venda - versão robusta
async function salvarItensVenda(req, res) {
  try {
    let { venda_id, itens } = req.body;

    // DEBUG: log do body quando inválido (ajuda a descobrir o que o front está mandando)
    if (!venda_id || (!itens && itens !== undefined)) {
      console.error(
        "Payload inválido - ausência de venda_id ou itens:",
        req.body
      );
    }

    // Normaliza: permite enviar um único item como objeto ou um array de itens
    if (!Array.isArray(itens)) {
      if (itens && typeof itens === "object") {
        itens = [itens];
      } else {
        itens = [];
      }
    }

    // Validações básicas
    const vendaIdNum = Number(venda_id);
    if (!venda_id || Number.isNaN(vendaIdNum) || itens.length === 0) {
      console.error("Dados inválidos:", { venda_id, itens });
      return res
        .status(400)
        .send({
          msg: "Dados inválidos: venda_id e ao menos 1 item são obrigatórios.",
        });
    }

    // Valida cada item
    const itensParaCriar = [];
    for (const [idx, it] of itens.entries()) {
      const produto_id = it.produto_id ?? it.produtoId ?? null;
      const quantidade = Number(it.quantidade);
      const valor_unitario = Number(it.valor_unitario ?? it.valorUnitario);

      if (
        !produto_id ||
        Number.isNaN(quantidade) ||
        Number.isNaN(valor_unitario)
      ) {
        return res.status(400).send({
          msg: "Item inválido",
          detalhe: `Item na posição ${idx} precisa de produto_id, quantidade (número) e valor_unitario (número).`,
          itemRecebido: it,
        });
      }

      if (quantidade <= 0 || valor_unitario < 0) {
        return res.status(400).send({
          msg: "Valores inválidos no item",
          detalhe: `Quantidade deve ser > 0 e valor_unitario >= 0 (pos ${idx}).`,
          itemRecebido: it,
        });
      }

      itensParaCriar.push({
        venda_id: vendaIdNum,
        produto_id,
        quantidade,
        valor_unitario,
        subtotal: quantidade * valor_unitario,
      });
    }

    // sincroniza model (se necessário) - mantenho, mas geralmente não é preciso em produção
    await modelItemVenda.sync();

    // Use transação para criar todos os itens
    const transaction = await db.transaction();
    try {
      const itensCriados = [];
      for (const novo of itensParaCriar) {
        const criado = await modelItemVenda.create(novo, { transaction });
        itensCriados.push(criado);
      }

      await transaction.commit();

      // Atualiza total da venda (fora da transação para evitar deadlocks com queries complexas)
      await atualizarTotalVenda(vendaIdNum);

      // Se criou apenas 1 item, retorno item; se criou vários, retorno array
      return res.status(201).send({
        msg:
          itensCriados.length === 1
            ? "Item criado com sucesso!"
            : "Itens criados com sucesso!",
        item: itensCriados.length === 1 ? itensCriados[0] : undefined,
        itens: itensCriados.length > 1 ? itensCriados : undefined,
      });
    } catch (errTrans) {
      await transaction.rollback();
      console.error("Erro na transação ao criar itens:", errTrans);
      return res
        .status(500)
        .send({
          msg: "Erro ao criar itens (transação)",
          error: errTrans.message || errTrans,
        });
    }
  } catch (error) {
    console.error("Erro ao salvar item(s) da venda:", error);
    return res
      .status(500)
      .send({ msg: "Erro ao salvar item(s)", error: error.message || error });
  }
}

// Buscar itens da venda
async function listarItensVenda(req, res) {
  try {
    const { venda_id } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
        iv.id,
        iv.produto_id,
        p.nome AS produto,
        iv.quantidade,
        iv.valor_unitario,
        iv.subtotal
      FROM item_venda iv
      INNER JOIN produto p ON p.id = iv.produto_id
      WHERE iv.venda_id = ?
      `,
      { replacements: [venda_id] }
    );

    return res.status(200).json({ itens: rows });
  } catch (error) {
    console.error("Erro ao buscar itens da venda:", error);
    return res.status(500).json({ msg: "Erro ao buscar itens", error });
  }
}

// Editar item
async function editarItemVenda(req, res) {
  try {
    const { id } = req.params;

    const item = await modelItemVenda.findByPk(id);

    if (!item) {
      return res.status(404).send({ msg: "Item não encontrado" });
    }

    item.produto_id = req.body.produto_id;
    item.quantidade = req.body.quantidade;
    item.valor_unitario = req.body.valor_unitario;
    item.subtotal = item.quantidade * item.valor_unitario;

    await item.save();

    await atualizarTotalVenda(item.venda_id);

    return res.status(200).send({
      msg: "Item atualizado com sucesso",
      item,
    });
  } catch (error) {
    console.error("Erro ao editar item:", error);
    return res.status(500).send({ msg: "Erro ao editar item", error });
  }
}

// Excluir item
async function excluirItemVenda(req, res) {
  try {
    const { id } = req.params;

    const item = await modelItemVenda.findByPk(id);

    if (!item) {
      return res.status(404).send({ msg: "Item não encontrado" });
    }

    const venda_id = item.venda_id;

    await item.destroy();
    await atualizarTotalVenda(venda_id);

    return res.status(200).send({ msg: "Item excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir item:", error);
    return res.status(500).send({ msg: "Erro ao excluir item", error });
  }
}

export default {
  salvarItensVenda,
  listarItensVenda,
  editarItemVenda,
  excluirItemVenda,
};
