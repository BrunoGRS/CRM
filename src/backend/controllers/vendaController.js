import modelVenda from "../models/modelVenda.js";
import { db } from "../database/database.js";

async function criarVenda(req, res) {
  try {
    const venda = {
      cliente_id: req.body.cliente_id,
      vendedor_id: req.body.vendedor_id,
      data_venda: req.body.data_venda || new Date(),
      valor_total: req.body.valor_total,
      observacao: req.body.observacao || null,
    };

    await modelVenda.sync();
    const result = await modelVenda.create(venda);

    return res
      .status(201)
      .send({ msg: "Venda registrada com sucesso!", venda: result });
  } catch (error) {
    console.error("Erro ao criar venda:", error);
    return res.status(500).send({ msg: "Erro ao criar venda", error });
  }
}

async function listarVendas(req, res) {
  try {
    const [rows] = await db.query(`
        select v.Id as Codigo, c.razaoSocialEmpresa as Cliente,  v.valor_total as Total, v.observacao as Obs, DATE_FORMAT(v.data_venda,"%d/%m/%Y") as Data
        from vendas v
        inner join cliente c on c.id = v.cliente_id
      `);

    if (rows.length > 0) {
      res.status(200).send({ msg: rows });
    } else {
      res.status(404).send({ msg: false });
    }
  } catch (error) {
    console.error("Erro ao mostrar Usuários", error);
    res.status(404).send({ msg: false });
  }
}

async function visualizarVenda(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `
      SELECT 
        v.Id AS Codigo,
        c.razaoSocialEmpresa AS Cliente,
        v.valor_total AS Total,
        v.observacao AS Obs,
        DATE_FORMAT(v.data_venda, "%d/%m/%Y") AS Data
      FROM vendas v
      INNER JOIN cliente c ON c.id = v.cliente_id
      INNER JOIN usuario u ON u.id = v.vendedor_id
      WHERE v.Id = ?;
  `,
      {
        replacements: [id],
        type: db.QueryTypes.SELECT,
      }
    );

    if (rows.length === 0) {
      return res.status(404).json({ msg: "Venda não encontrada." });
    }

    res.status(200).json({ msg: rows[0] });
  } catch (error) {
    console.error("Erro ao mostrar Usuários", error);
    res.status(404).send({ msg: false });
  }
}

async function editarVenda(req, res) {
  try {
    const { id } = req.params;
    const venda = await modelVenda.findByPk(id);

    if (!venda) {
      return res.status(404).send({ msg: "Venda não encontrada" });
    }

    venda.cliente_id = req.body.cliente_id || venda.cliente_id;
    venda.vendedor_id = req.body.vendedor_id || venda.vendedor_id;
    venda.data_venda = req.body.data_venda || venda.data_venda;
    venda.valor_total = req.body.valor_total || venda.valor_total;
    venda.observacao = req.body.observacao || venda.observacao;

    await venda.save();

    return res.status(200).send({ msg: "Venda atualizada com sucesso", venda });
  } catch (error) {
    console.error("Erro ao editar venda:", error);
    return res.status(500).send({ msg: "Erro ao editar venda", error });
  }
}

async function excluirVenda(req, res) {
  try {
    const { id } = req.params;
    const venda = await modelVenda.findByPk(id);

    if (!venda) {
      return res.status(404).send({ msg: "Venda não encontrada" });
    }

    await venda.destroy();

    return res.status(200).send({ msg: "Venda excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir venda:", error);
    return res.status(500).send({ msg: "Erro ao excluir venda", error });
  }
}

export default {
  criarVenda,
  listarVendas,
  visualizarVenda,
  editarVenda,
  excluirVenda,
};
