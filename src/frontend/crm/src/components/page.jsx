import React, { useState, useEffect } from "react";
import "./css/Page.css";
import { toast } from "react-toastify";

export const Page = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    usuario: "",
    email: "",
    senha: "",
    telefone: "",
  });

  // Função para criar usuário
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
        setFormData({ nome: "", usuario: "", email: "", senha: "", telefone: "" });
        fetchUsuarios(); // Atualiza a lista
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

  return (
    <div className="layout">
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
            onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={formData.senha}
            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Telefone"
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
          />
          <button type="submit">Criar Usuário</button>
        </form>

        {/* Lista de usuários */}
        {users.length === 0 ? (
          <p>Nenhum usuário encontrado.</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Usuário</th>
                <th>Email</th>
                <th>Telefone</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={index}>
                  <td>{u.nome}</td>
                  <td>{u.usuario}</td>
                  <td>{u.email}</td>
                  <td>{u.telefone || "-"}</td>
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
