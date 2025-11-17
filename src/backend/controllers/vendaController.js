import modelVenda from "../models/modelVenda.js";
import modelVendaItem from "../models/modelItemVenda.js";
import { db } from "../database/database.js";

// ======================================================
// Criar Venda + Itens
// ======================================================
async function criarVenda(req, res) {
  const transaction = await db.transaction();
  try {
    const venda = {
      cliente_id: req.body.cliente_id,
      vendedor_id: req.body.vendedor_id,
      data_venda: req.body.data_venda || new Date(),
      valor_total: req.body.valor_total,
      observacao: req.body.observacao || null,
    };

    const itens = req.body.itens || [];

    await modelVenda.sync();
    await modelVendaItem.sync();

    // Criar venda
    const novaVenda = await modelVenda.create(venda, { transaction });

    // Criar itens da venda
    for (const item of itens) {
      await modelVendaItem.create(
        {
          venda_id: novaVenda.id,
          produto_id: item.produto_id,
          quantidade: item.quantidade,
          valor_unitario: item.valor_unitario,
          valor_total: item.valor_total,
        },
        { transaction }
      );
    }

    await transaction.commit();

    return res
      .status(201)
      .send({ msg: "Venda registrada com sucesso!", venda: novaVenda });
  } catch (error) {
    console.error("Erro ao criar venda:", error);
    await transaction.rollback();
    return res.status(500).send({ msg: "Erro ao criar venda", error });
  }
}

// ======================================================
// Listar vendas
// ======================================================
async function listarVendas(req, res) {
  try {
    const [rows] = await db.query(`
      SELECT 
        v.Id AS Codigo, 
        c.razaoSocialEmpresa AS Cliente,  
        v.valor_total AS Total, 
        v.observacao AS Obs, 
        DATE_FORMAT(v.data_venda, "%d/%m/%Y") AS Data
      FROM vendas v
      INNER JOIN cliente c ON c.id = v.cliente_id
      ORDER BY v.id DESC;
    `);

    if (rows.length > 0) {
      return res.status(200).send({ msg: rows });
    } else {
      return res.status(404).send({ msg: false });
    }
  } catch (error) {
    console.error("Erro ao mostrar Vendas", error);
    return res.status(500).send({ msg: false });
  }
}

// ======================================================
// Visualizar venda (detalhes + itens)
// ======================================================
async function visualizarVenda(req, res) {
  try {
    const { id } = req.params;

    // Buscar dados da venda
    const [venda] = await db.query(
      `
      SELECT 
        v.Id AS Codigo,
        c.razaoSocialEmpresa AS Cliente,
        v.valor_total AS Total,
        v.observacao AS Obs,
        DATE_FORMAT(v.data_venda, "%d/%m/%Y") AS Data
      FROM vendas v
      INNER JOIN cliente c ON c.id = v.cliente_id
      WHERE v.id = ?;
      `,
      { replacements: [id] }
    );

    if (!venda.length) {
      return res.status(404).json({ msg: "Venda não encontrada." });
    }

    // Buscar itens da venda
    const [itens] = await db.query(
      `
      SELECT 
        i.id,
        i.produto_id,
        p.nome AS produto,
        i.quantidade,
        i.valor_unitario,
        i.valor_total
      FROM venda_itens i
      INNER JOIN produtos p ON p.id = i.produto_id
      WHERE i.venda_id = ?;
      `,
      { replacements: [id] }
    );

    return res.status(200).json({
      venda: venda[0],
      itens: itens,
    });
  } catch (error) {
    console.error("Erro ao mostrar Venda", error);
    return res.status(500).send({ msg: false });
  }
}

// ======================================================
// Visualizar venda somente pelo ID (simples)
// ======================================================
async function visualizarVendaId(req, res) {
  try {
    const { id } = req.params;
    const data = await modelVenda.findByPk(id);

    if (data) {
      return res.status(200).json({ msg: data });
    } else {
      return res.status(404).json({ msg: "Venda não encontrada" });
    }
  } catch (error) {
    console.error("Erro ao mostrar Venda", error);
    return res.status(500).send({ msg: false });
  }
}

// ======================================================
// Editar Venda + Itens
// ======================================================
async function editarVenda(req, res) {
  const transaction = await db.transaction();

  try {
    const { id } = req.params;
    const venda = await modelVenda.findByPk(id);

    if (!venda) {
      return res.status(404).send({ msg: "Venda não encontrada" });
    }

    // Atualizar venda
    await venda.update(
      {
        cliente_id: req.body.cliente_id,
        vendedor_id: req.body.vendedor_id,
        data_venda: req.body.data_venda,
        valor_total: req.body.valor_total,
        observacao: req.body.observacao,
      },
      { transaction }
    );

    // Atualizar itens
    const itens = req.body.itens || [];

    await modelVendaItem.destroy({
      where: { venda_id: id },
      transaction,
    });

    for (const item of itens) {
      await modelVendaItem.create(
        {
          venda_id: id,
          produto_id: item.produto_id,
          quantidade: item.quantidade,
          valor_unitario: item.valor_unitario,
          valor_total: item.valor_total,
        },
        { transaction }
      );
    }

    await transaction.commit();
    return res.status(200).send({ msg: "Venda atualizada com sucesso" });
  } catch (error) {
    console.error("Erro ao editar venda:", error);
    await transaction.rollback();
    return res.status(500).send({ msg: "Erro ao editar venda", error });
  }
}

// ======================================================
// Excluir Venda + Itens
// ======================================================
async function excluirVenda(req, res) {
  const transaction = await db.transaction();

  try {
    const { id } = req.params;

    const venda = await modelVenda.findByPk(id);
    if (!venda) {
      return res.status(404).send({ msg: "Venda não encontrada" });
    }

    await modelVendaItem.destroy({
      where: { venda_id: id },
      transaction,
    });

    await venda.destroy({ transaction });

    await transaction.commit();
    return res.status(200).send({ msg: "Venda excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir venda:", error);
    await transaction.rollback();
    return res.status(500).send({ msg: "Erro ao excluir venda", error });
  }
}

export default {
  criarVenda,
  listarVendas,
  visualizarVenda,
  editarVenda,
  excluirVenda,
  visualizarVendaId,
};
