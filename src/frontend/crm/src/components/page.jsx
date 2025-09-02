import React, { useState, useEffect } from "react";
import "./css/Page.css";
import { toast } from "react-toastify";
import { Layout } from "lucide-react";
import { useParams } from "react-router-dom";

export const Page = () => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    usuario: "",
    email: "",
    senha: "",
    telefone: "",
  });

  const criarUsuario = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/usuario/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        toast.success("Usuário criado com sucesso!");
        setFormData({
          nome: "",
          usuario: "",
          email: "",
          senha: "",
          telefone: "",
        });
        fetchUsuarios();
      } else {
        toast.error("Erro ao criar usuário");
      }
    } catch (err) {
      toast.error("Erro ao criar usuário");
    }
  };

  // Função para listar usuários
  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/usuario/listar");
      const inf = await response.json();
      const listaUsuarios = Array.isArray(inf.msg) ? inf.msg : [];
      setUsers(listaUsuarios);
    } catch (error) {
      toast.error("Erro ao listar usuários");
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

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
    } catch (error) {
      toast.error("Erro ao deletar usuários");
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div className="layout">
      <Layout />
      <main className="content">
        <h2>Gerenciamento de Usuários</h2>

        {/* Formulário para criar usuário */}
        <form className="user-form" onSubmit={criarUsuario}>
          <input
            type="text"
            placeholder="Nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
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
            onChange={(e) =>
              setFormData({ ...formData, telefone: e.target.value })
            }
          />
          <button onClick={criarUsuario}>Criar Usuário</button>
        </form>

        {/* Lista de usuários */}
        {users.length === 0 ? (
          <p>Nenhum usuário encontrado.</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>id</th>
                <th>Nome</th>
                <th>Usuário</th>
                <th>Email</th>
                <th>Telefone</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={index}>
                  <td>{u.id}</td>
                  <td>{u.nome}</td>
                  <td>{u.usuario}</td>
                  <td>{u.email}</td>
                  <td>{u.telefone || "-"}</td>
                  <button
                    className="button-editar"
                    onClick={(e) =>
                      setFormData({
                        ...formData,
                        nome: u.nome,
                        usuario: u.usuario,
                        email: u.email,
                        senha: u.senha,
                        telefone: u.telefone || "",
                      })
                    }
                  >
                    Editar
                  </button>
                  <button
                    className="button-excluir"
                    onClick={(e) => excluirUsuario(u.id)}
                  >
                    Excluir
                  </button>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default Page;
