import { db } from "../database/database.js";
import modelUsuario from "../models/modelUsuario.js";
import { Sequelize } from "sequelize";

async function criarUser(req, res) {
  try {
    const user = {
      nome: req.body.nome,
      usuario: req.body.usuario,
      senha: req.body.senha,
      email: req.body.email,
      telefone: req.body.telefone || null,
    };

    if (!modelUsuario.sync().isPendig) {
      await modelUsuario.sync();
    }

    const result = await modelUsuario.create(user);

    if (result) {
      res.status(201).send({ msg: "Usuário cadastrado com sucesso!" });
    }
  } catch (error) {
    res.status(500).send({ msg: `Erro: ${error}` });
    console.log(error);
  }
}

async function editarUser(req, res) {
  try {
    let user = modelUsuario.findByPk(req.params.id);

    if (user) {
      user.then(
        (dado) => {
          (dado.nome = req.body.nome),
            (dado.usuario = req.body.usuario),
            (dado.senha = req.body.senha),
            (dado.email = req.body.email),
            (dado.telefone = req.body.telefone || null);

          if (dado.save() != null) {
            res
              .status(200)
              .send({
                msg: `Usuario atualizado com sucesso. Usuario: ${dado.id} - ${dado.nome}`,
              });
          }
        },
        (error) => {
          console.error("Erro ao atualizar Usuario", error);
        }
      );
    }
  } catch (error) {
    console.error("Erro ao Editar Usuário", error);
  }
}

async function mostrarUser(req, res) {
  try {
    let user = modelUsuario.findAll();

    if (user) {
      user.then(
        (dados) => {
          res.status(200).send({ msg: dados });
        },
        (error) => {
          onsole.error("Erro ao mostrar Usuários", error);
        }
      );
    }
  } catch (error) {
    console.error("Erro ao mostrar Usuários", error);
  }
}

async function deleteUser(req, res) {
  try {
    let user = modelUsuario.findByPk(req.params.id);

    if (user) {
      user.then(
        (dado) => {
          if (dado.destroy()) {
            res
              .status(200)
              .send({ msg: `Usuário ${dado.nome} deletado com sucesso!` });
          }
        },
        (error) => {
          onsole.error("Erro ao deletar Usuário", error);
        }
      );
    }
  } catch (error) {
    console.error("Erro ao Deletar Usuário", error);
  }
}

async function validarUser(req, res) {
  try {
    let info = [];

    const user = {
      usuario: req.body.usuario,
      senha: req.body.senha,
    };

    info = await db.query(
      `SELECT usuario, senha FROM usuario WHERE usuario = ? AND senha = ?`,
      {
        replacements: [user.usuario, user.senha],
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    console.log(info);

    if (info.length > 0) {
      res.status(200).send({ msg: true });
    } else {
      res.status(404).send({ msg: false });
    }
  } catch (error) {
    res.status(500).send({ msg: `Erro: ${error}` });
    console.log(error);
  }
}

export default { criarUser, deleteUser, editarUser, mostrarUser, validarUser };
