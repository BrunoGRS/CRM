import React, { useState, useEffect } from "react";
import "./css/usuario.css";
import { toast } from "react-toastify";
import { Navbar } from "./navbar";
import MenuAcoesSemPdf from "./menuAcoesSemPdf.jsx";

export const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [busca, setBusca] = useState("");

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);

  const [formData, setFormData] = useState({
    nome: "",
    usuario: "",
    email: "",
    senha: "",
    telefone: "",
    IdPermissao: "",
  });

  const [botao, setBotao] = useState(true);
  const [IdUser, setIdUser] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const onlyNumbers = (value) => value.replace(/\D/g, "");

  const formatPhone = (value) => {
    const digits = onlyNumbers(value || "");

    if (digits.length <= 10) {
      return digits
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      return digits
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/usuario/listar");
      const inf = await response.json();
      const listaUsuarios = Array.isArray(inf.msg) ? inf.msg : [];
      setUsers(listaUsuarios);
    } catch {
      toast.error("Erro ao listar usuários");
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  useEffect(() => {
    setPaginaAtual(1);
  }, [busca]);

  const listaFiltrada = users.filter((u) => {
    const txt = busca.toLowerCase();
    return (
      String(u.id).includes(txt) ||
      (u.nome || "").toLowerCase().includes(txt) ||
      (u.usuario || "").toLowerCase().includes(txt) ||
      (u.email || "").toLowerCase().includes(txt) ||
      (u.Permissao || "").toLowerCase().includes(txt)
    );
  });

  const indexUltimo = paginaAtual * itensPorPagina;
  const indexPrimeiro = indexUltimo - itensPorPagina;
  const listaAtual = listaFiltrada.slice(indexPrimeiro, indexUltimo);
  const totalPaginas = Math.ceil(listaFiltrada.length / itensPorPagina);

  const criarUsuario = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        telefone: onlyNumbers(formData.telefone),
      };

      const response = await fetch("http://localhost:3000/api/usuario/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 201) {
        toast.success("Usuário criado com sucesso!");
        setFormData({
          nome: "",
          usuario: "",
          email: "",
          senha: "",
          telefone: "",
          IdPermissao: "",
        });
        fetchUsuarios();
        setMostrarFormulario(false);
        toast.success("Usuário criado com sucesso!");
      } else {
        toast.error("Erro ao criar usuário");
      }
    } catch {
      toast.error("Erro ao criar usuário");
    }
  };

  const excluirUsuario = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/usuario/delete/${id}`,
        { method: "DELETE" }
      );

      if (response.status === 200) {
        toast.success("Usuário deletado com sucesso!");
        fetchUsuarios();
      } else {
        toast.error("Erro ao deletar usuário");
      }
    } catch {
      toast.error("Erro ao deletar usuário");
    }
  };

  const editarUsuario = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        telefone: onlyNumbers(formData.telefone),
      };

      const response = await fetch(
        `http://localhost:3000/api/usuario/editar/${IdUser}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.status === 200) {
        setFormData({
          nome: "",
          usuario: "",
          email: "",
          senha: "",
          telefone: "",
          IdPermissao: "",
        });
        setBotao(true);
        fetchUsuarios();
        setMostrarFormulario(false);
        toast.success("Usuário atualizado com sucesso!");
      } else {
        toast.error("Erro ao atualizar usuário");
      }
    } catch {
      toast.error("Erro ao atualizar usuário");
    }
  };

  return (
    <div className="layout">
      <Navbar />

      <main className="content">
        <h2>Gerenciamento de Usuários</h2>

        {!mostrarFormulario && (
          <>
            <button
              className="btn-criar-novo"
              onClick={() => {
                setMostrarFormulario(true);
                setBotao(true);
                setFormData({
                  nome: "",
                  usuario: "",
                  email: "",
                  senha: "",
                  telefone: "",
                  IdPermissao: "",
                });
              }}
            >
              + Criar Novo Usuário
            </button>
            <input
              type="text"
              className="input-busca"
              placeholder="Buscar por código, nome, usuário, email ou permissão..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </>
        )}

        {mostrarFormulario && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>{botao ? "Novo Usuário" : "Editar Usuário"}</h3>

              <form
                className="produto-form"
                onSubmit={botao ? criarUsuario : editarUsuario}
              >
                <input
                  type="text"
                  placeholder="Nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Usuário"
                  value={formData.usuario}
                  onChange={(e) =>
                    setFormData({ ...formData, usuario: e.target.value })
                  }
                  required
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />

                <input
                  type="password"
                  placeholder="Senha"
                  value={formData.senha}
                  onChange={(e) =>
                    setFormData({ ...formData, senha: e.target.value })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Telefone"
                  value={formData.telefone}
                  maxLength={15}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      telefone: formatPhone(e.target.value),
                    })
                  }
                />

                <select
                  value={formData.IdPermissao || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, IdPermissao: e.target.value })
                  }
                  required
                >
                  <option value="">Selecione uma permissão</option>
                  <option value="1">Administrador</option>
                  <option value="2">Vendedor</option>
                  <option value="3">Manutenção</option>
                </select>

                <div className="botoes-form">
                  <button type="submit">
                    {botao ? "Criar Usuário" : "Salvar Alterações"}
                  </button>

                  <button
                    type="button"
                    className="btn-cancelar"
                    onClick={() => setMostrarFormulario(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {listaFiltrada.length === 0 ? (
          <p>Nenhum usuário encontrado.</p>
        ) : (
          <>
            <table className="user-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nome</th>
                  <th>Usuário</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Permissão</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {listaAtual.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.nome}</td>
                    <td>{u.usuario}</td>
                    <td>{u.email}</td>
                    <td>{u.telefone ? formatPhone(u.telefone) : "-"}</td>
                    <td>{u.Permissao}</td>
                    <td>
                      <MenuAcoesSemPdf
                        onEditar={() => {
                          setFormData({
                            nome: u.nome,
                            usuario: u.usuario,
                            email: u.email,
                            senha: u.senha,
                            telefone: u.telefone || "",
                            IdPermissao: u.Permissao,
                          });
                          setBotao(false);
                          setIdUser(u.id);
                          setMostrarFormulario(true);
                        }}
                        onExcluir={() => excluirUsuario(u.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="paginacao-container">
              <button
                onClick={() => setPaginaAtual(paginaAtual - 1)}
                disabled={paginaAtual === 1}
                className="btn-paginacao"
              >
                Anterior
              </button>

              {Array.from({ length: totalPaginas }, (_, i) => (
                <button
                  key={i + 1}
                  className={`btn-paginacao ${
                    paginaAtual === i + 1 ? "ativo" : ""
                  }`}
                  onClick={() => setPaginaAtual(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPaginaAtual(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
                className="btn-paginacao"
              >
                Próximo
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Usuarios;
