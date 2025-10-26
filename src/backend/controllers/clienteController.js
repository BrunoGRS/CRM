import modelCliente from "../models/modelCliente.js";

async function criarCliente(req, res) {
  try {
    const cliente = {
      nome_contato: req.body.nome_contato || null,
      fantasiaEmpresa: req.body.fantasiaEmpresa || null,
      razaoSocialEmpresa: req.body.razaoSocialEmpresa,
      email: req.body.email || null,
      telefone: req.body.telefone || null,
      status: req.body.status,
      cidade: req.body.cidade || null,
      bairro: req.body.bairro || null,
      ruaEndereco: req.body.ruaEndereco || null,
      numeroEndereco: req.body.numeroEndereco || null,
      complemento: req.body.complemento || null,
      cnpj_cpf: req.body.cnpj_cpf,
    };

    if (!modelCliente.sync().isPendig) {
      await modelCliente.sync();
    }

    const result = await modelCliente.create(cliente);

    if (result) {
      res.status(201).send({ msg: "Cliente cadastrado com sucesso!" });
    }
  } catch (error) {
    res.status(500).send({ msg: `Erro: ${error}` });
    console.log(error);
  }
}

async function editarCliente(req, res) {
  try {
    let cliente = modelCliente.findByPk(req.params.id);

    if (cliente) {
      cliente.then(
        (dado) => {
          (dado.nome_contato = req.body.nome_contato || null),
            (dado.fantasiaEmpresa = req.body.fantasiaEmpresa || null),
            (dado.razaoSocialEmpresa = req.body.razaoSocialEmpresa),
            (dado.email = req.body.email || null),
            (dado.telefone = req.body.telefone || null),
            (dado.status = req.body.status || null),
            (dado.cidade = req.body.cidade || null),
            (dado.bairro = req.body.bairro || null),
            (dado.ruaEndereco = req.body.ruaEndereco || null),
            (dado.numeroEndereco = req.body.numeroEndereco || null),
            (dado.complemento = req.body.complemento || null),
            (dado.cnpj_cpf = req.body.cnpj_cpf);

          if (dado.save() != null) {
            res.status(200).send({
              msg: `Cliente atualizado com sucesso. Usuario: ${dado.id} - ${dado.nome}`,
            });
          }
        },
        (error) => {
          console.error("Erro ao atualizar Cliente", error);
        }
      );
    }
  } catch (error) {
    console.error("Erro ao Editar Cliente", error);
  }
}

async function mostrarCliente(req, res) {
  try {
    let cliente = modelCliente.findAll();

    if (cliente) {
      cliente.then(
        (dados) => {
          res.status(200).send({ msg: dados });
        },
        (error) => {
          onsole.error("Erro ao mostrar Clientes", error);
        }
      );
    }
  } catch (error) {
    console.error("Erro ao mostrar Cliente", error);
  }
}

async function deleteCliente(req, res) {
  try {
    let cliente = modelCliente.findByPk(req.params.id);

    if (cliente) {
      cliente.then(
        (dado) => {
          if (dado.destroy()) {
            res
              .status(200)
              .send({ msg: `Cliente ${dado.nome} deletado com sucesso!` });
          }
        },
        (error) => {
          onsole.error("Erro ao deletar Cliente", error);
        }
      );
    }
  } catch (error) {
    console.error("Erro ao Deletar Cliente", error);
  }
}

export default {
  criarCliente,
  mostrarCliente,
  editarCliente,
  deleteCliente,
};
