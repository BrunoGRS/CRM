import { db } from "../database/database.js";
import modelProduto from "../models/modelProduto.js";
import { Sequelize } from "sequelize";

async function criarProduto(req, res) {
  try {
    const produto = {
      nome: req.body.nome,
      preco: req.body.preco,
      estoque: req.body.estoque,
      categoria_id: req.body.categoria_id || null,
      marca_id: req.body.marca_id || null,
    };

    if (!modelProduto.sync().isPendig) {
      await modelProduto.sync();
    }

    const result = await modelProduto.create(produto);

    if (result) {
      res.status(201).send({ msg: "Produto cadastrado com sucesso!" });
    }
  } catch (error) {
    console.error(error);
  }
}

async function editarProduto(req, res) {
  try {
    let produto = modelProduto.findByPk(req.params.id);

    if (produto) {
      produto
        .then((dado) => {
          (dado.nome = req.body.nome),
            (dado.preco = req.body.preco),
            (dado.estoque = req.body.estoque),
            (dado.categora_id = req.body.categora_id || null),
            (dado.marca_id = req.body.marca_id || null);

          if (dado.save() != null) {
            res.status(200).send({
              msg: `Produto atualizado com sucesso. Produto: ${dado.id} - ${dado.nome}`,
            });
          }
        })
        .catch((error) => {
          res.status(500).send({
            msg: `Erro ao atualizar produto, ${error}`,
          });
        });
    }
  } catch (error) {
    console.error(error);
  }
}

async function listarProdutos(req, res) {
  try {
    const result = modelProduto.findAll();

    if ((await result).length > 0) {
      res.status(200).send({
        msg: result,
      });
    } else {
      res.status(500).send({
        msg: `Erro ao listar produto, ${error}`,
      });
    }
  } catch (error) {
    console.error;
  }
}

async function deletarProduto(req, res) {
  try {
    let produto = modelProduto.findByPk(req.params.id);

    if (produto) {
      produto.then((dado) => {
        if (dado.destroy()) {
          res.status(200).send({
            msg: "Produto excluído com sucesso!",
          });
        }
      });
    } else {
      res.status(500).send({
        msg: `Erro ao Excluir produto, ${error}`,
      });
    }
  } catch (error) {
    console.error(error);
  }
}

export default { criarProduto, editarProduto, listarProdutos, deletarProduto };
