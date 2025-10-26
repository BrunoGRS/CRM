import React, { useState, useEffect } from "react";
import "./css/usuario.css";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Navbar } from "./navbar";

export const Produtos = () => {
  const { id } = useParams();
  const [produtos, setProdutos] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
    estoque: "",
    categoria_id: "",
    marca_id: "",
  });
  const [botao, setBotao] = useState(true);
  const [IdProduto, setIdProduto] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Criar Usuário
  const criarProduto = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/produto/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        toast.success("Produto criado com sucesso!");
        setFormData({
          nome: "",
          preco: "",
          estoque: "",
          categoria_id: "",
          marca_id: "",
        });
        fetchUsuarios();
        setMostrarFormulario(false);
      } else {
        toast.error("Erro ao criar produto");
      }
    } catch {
      toast.error("Erro ao criar produto");
    }
  };

  const fetchProdutos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/produto/listar");
      const inf = await response.json();
      const listaProdutos = Array.isArray(inf.msg) ? inf.msg : [];
      setProdutos(listaProdutos);
    } catch {
      toast.error("Erro ao listar produtos");
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  // Excluir
  const excluirProduto = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/produto/delete/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        toast.success("Produto deletado com sucesso!");
        fetchUsuarios();
      } else {
        toast.error("Erro ao deletar produto");
      }
    } catch {
      toast.error("Erro ao deletar produto");
    }
  };

  // Editar
  const editarProduto = async (e, id) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/produto/editar/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.status === 200) {
        toast.success("Produto atualizado com sucesso!");
        setFormData({
          nome: "",
          preco: "",
          estoque: "",
          categoria_id: "",
          marca_id: "",
        });
        setBotao(true);
        fetchProdutos();
        setMostrarFormulario(false);
      } else {
        toast.error("Erro ao atualizar produto");
      }
    } catch {
      toast.error("Erro ao atualizar produto");
    }
  };

  return (
    <div className="layout">
      <Navbar />
      <main className="content">
        <h2>Gerenciamento de Produtos</h2>

        {/* Botão principal */}
        {!mostrarFormulario && (
          <button
            className="btn-criar-novo"
            onClick={() => {
              setMostrarFormulario(true);
              setBotao(true);
              setFormData({
                nome: "",
                preco: "",
                estoque: "",
                categoria_id: "",
                marca_id: "",
              });
            }}
          >
            + Criar Novo Produto
          </button>
        )}

        {/* Formulário aparece apenas quando clicar */}
        {mostrarFormulario && (
          <form
            className="produto-form"
            onSubmit={botao ? criarProduto : (e) => editarProduto(e, IdProduto)}
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
              type="number"
              step="0.01"
              placeholder="Preço"
              value={formData.preco}
              onChange={(e) =>
                setFormData({ ...formData, preco: e.target.value })
              }
              required
            />
            <input
              type="number"
              placeholder="Estoque"
              value={formData.estoque}
              onChange={(e) =>
                setFormData({ ...formData, estoque: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Categoria"
              value={formData.categoria_id}
              onChange={(e) =>
                setFormData({ ...formData, categoria_id: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Marca"
              value={formData.marca_id}
              onChange={(e) =>
                setFormData({ ...formData, marca_id: e.target.value })
              }
            />

            <div className="botoes-form">
              <button type="submit">
                {botao ? "Criar Produto" : "Salvar Alterações"}
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
        )}

        {produtos.length === 0 ? (
          <p>Nenhum Produto encontrado.</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nome}</td>
                  <td>{p.preco}</td>
                  <td>{p.estoque}</td>
                  <td>
                    <button
                      className="button-editar"
                      onClick={() => {
                        setFormData({
                          nome: p.nome,
                          preco: p.preco,
                          estoque: p.estoque,
                          categoria_id: p.categoria_id || "",
                          marca_id: p.marca_id || "",
                        });
                        setBotao(false);
                        setIdProduto(p.id);
                        setMostrarFormulario(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="button-excluir"
                      onClick={() => excluirProduto(p.id)}
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

export default Produtos;
