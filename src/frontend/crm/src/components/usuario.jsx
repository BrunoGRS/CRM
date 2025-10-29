import React, { useState, useEffect } from "react";
import "./css/usuario.css";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Navbar } from "./navbar";

export const Usuarios = () => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
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
  const [value, setValue] = useState("");

  // --- Funções auxiliares ---
  const onlyNumbers = (value) => value.replace(/\D/g, "");

  // Máscara simples de telefone (aceita formatos 8 e 9 dígitos)
  const formatPhone = (value) => {
    const digits = onlyNumbers(value);

    if (digits.length <= 10) {
      // (99) 9999-9999
      return digits
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      // (99) 99999-9999
      return digits
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
  };

  // --- Criar Usuário ---
  const criarUsuario = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        telefone: onlyNumbers(formData.telefone), // envia só números
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
      } else {
        toast.error("Erro ao criar usuário");
      }
    } catch {
      toast.error("Erro ao criar usuário");
    }
  };

  // --- Listar Usuários ---
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

  // --- Excluir Usuário ---
  const excluirUsuario = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/usuario/delete/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
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

  // --- Editar Usuário ---
  const editarUsuario = async (e, id) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        telefone: onlyNumbers(formData.telefone),
      };

      const response = await fetch(
        `http://localhost:3000/api/usuario/editar/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.status === 200) {
        toast.success("Usuário atualizado com sucesso!");
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

        {/* Botão principal */}
        {!mostrarFormulario && (
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
        )}

        {/* Formulário aparece apenas quando clicar */}
        {mostrarFormulario && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>{botao ? "Novo Usuário" : "Editar Usuário"}</h3>

              <form
                className="produto-form"
                onSubmit={
                  botao ? criarUsuario : (e) => editarUsuario(e, IdUser)
                }
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

        {/* Lista de usuários */}
        {users.length === 0 ? (
          <p>Nenhum usuário encontrado.</p>
        ) : (
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
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nome}</td>
                  <td>{u.usuario}</td>
                  <td>{u.email}</td>
                  <td>{u.telefone ? formatPhone(u.telefone) : "-"}</td>
                  <th>{u.Permissao}</th>
                  <td>
                    <button
                      className="button-editar"
                      onClick={() => {
                        setFormData({
                          nome: u.nome,
                          usuario: u.usuario,
                          email: u.email,
                          senha: u.senha,
                          telefone: formatPhone(u.telefone || ""),
                          IdPermissao: u.IdPermissao,
                        });
                        setBotao(false);
                        setIdUser(u.id);
                        setMostrarFormulario(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="button-excluir"
                      onClick={() => excluirUsuario(u.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default Usuarios;
