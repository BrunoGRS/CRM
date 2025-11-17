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

// Criar itens da venda
async function salvarItensVenda(req, res) {
  try {
    const { venda_id, itens } = req.body;

    if (!venda_id || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).send({ msg: "Dados inválidos." });
    }

    await modelItemVenda.sync();

    const itensCriados = [];

    for (const item of itens) {
      const novoItem = await modelItemVenda.create({
        venda_id,
        produto_id: item.produto_id,
        quantidade: item.quantidade,
        valor_unitario: item.valor_unitario,
        subtotal: item.quantidade * item.valor_unitario,
      });

      itensCriados.push(novoItem);
    }

    await atualizarTotalVenda(venda_id);

    return res.status(201).send({
      msg: "Itens adicionados com sucesso!",
      itens: itensCriados,
    });
  } catch (error) {
    console.error("Erro ao salvar itens da venda:", error);
    return res.status(500).send({ msg: "Erro ao salvar itens", error });
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

    item.produto_id = req.body.produto_id || item.produto_id;
    item.quantidade = req.body.quantidade || item.quantidade;
    item.valor_unitario = req.body.valor_unitario || item.valor_unitario;

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
