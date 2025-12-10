import { db } from "../database/database.js";
import modelUsuario from "../models/modelUsuario.js";
import { Sequelize } from "sequelize";
import crypto from "crypto";
import { enviarEmail } from "../emailServer.js";
import { info } from "console";

async function criarUser(req, res) {
  try {
    const user = {
      nome: req.body.nome,
      usuario: req.body.usuario,
      senha: req.body.senha,
      email: req.body.email,
      telefone: req.body.telefone || null,
      IdPermissao: req.body.IdPermissao,
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
            (dado.telefone = req.body.telefone || null),
            (dado.IdPermissao = req.body.IdPermissao);

          if (dado.save() != null) {
            res.status(200).send({
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
    const [rows] = await db.query(`
      SELECT u.id, u.nome, u.usuario, u.senha, u.email, u.telefone, p.nome AS Permissao
      FROM usuario u
      LEFT JOIN permissao p ON p.Id = u.IdPermissao
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
    const { usuario, senha } = req.body;

    const info = await db.query(
      `
      SELECT 
        u.usuario, 
        u.IdPermissao AS Codigo,
        u.senha,
        p.Nome AS Permissao
      FROM usuario u
      LEFT JOIN permissao p ON p.id = u.IdPermissao
      WHERE u.usuario = ? AND u.senha = ?
      `,
      {
        replacements: [usuario, senha],
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (info.length > 0) {
      res.status(200).send({
        msg: true,
        usuario: info[0].usuario,
        codigoPermissao: info[0].Codigo,
        nomePermissao: info[0].Permissao,
      });
    } else {
      res.status(404).send({ msg: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: `Erro: ${error}` });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await modelUsuario.findOne({ where: { email } });

    if (!user) {
      return res.status(200).json({
        message:
          "Se um usuário com este e-mail existir, um link de redefinição foi enviado.",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    user.reset_password_token = resetToken;
    user.reset_password_expires = expires;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

    const assunto = "Redefinição de Senha - CoffeeCRM";
    const texto = `Olá, ${user.nome}.\n\nVocê solicitou a redefinição da sua senha. Clique no link a seguir para continuar: ${resetLink}\n\nEste link é válido por 1 hora.\n\nSe não foi você, ignore este e-mail.`;

    await enviarEmail(user.email, assunto, texto);

    res.status(200).json({
      message:
        "Se um usuário com este e-mail existir, um link de redefinição foi enviado.",
    });
  } catch (error) {
    console.error("Erro em forgotPassword:", error);
    res.status(500).json({ error: "Ocorreu um erro interno no servidor." });
  }
}

export default {
  criarUser,
  deleteUser,
  editarUser,
  mostrarUser,
  validarUser,
  forgotPassword,
};
