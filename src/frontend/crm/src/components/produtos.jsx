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
  const [mostrarModal, setMostrarModal] = useState(false);

  // Criar Produto
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
        fetchProdutos();
        setMostrarModal(false);
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
        fetchProdutos();
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
        setMostrarModal(false);
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
        <button
          className="btn-criar-novo"
          onClick={() => {
            setMostrarModal(true);
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

        {/* Tabela */}
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
                        setMostrarModal(true);
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

        {/* MODAL */}
        {mostrarModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{botao ? "Novo Produto" : "Editar Produto"}</h3>
                <button
                  className="modal-close"
                  onClick={() => setMostrarModal(false)}
                >
                  ×
                </button>
              </div>

              <form
                className="produto-form"
                onSubmit={
                  botao ? criarProduto : (e) => editarProduto(e, IdProduto)
                }
              >
                <label>Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  required
                />

                <label>Preço</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) =>
                    setFormData({ ...formData, preco: e.target.value })
                  }
                  required
                />

                <label>Estoque</label>
                <input
                  type="number"
                  value={formData.estoque}
                  onChange={(e) =>
                    setFormData({ ...formData, estoque: e.target.value })
                  }
                  required
                />

                <label>Categoria</label>
                <input
                  type="text"
                  value={formData.categoria_id}
                  onChange={(e) =>
                    setFormData({ ...formData, categoria_id: e.target.value })
                  }
                />

                <label>Marca</label>
                <input
                  type="text"
                  value={formData.marca_id}
                  onChange={(e) =>
                    setFormData({ ...formData, marca_id: e.target.value })
                  }
                />

                <div className="botoes-form">
                  <button type="submit">
                    {botao ? "Salvar Produto" : "Salvar Alterações"}
                  </button>
                  <button
                    type="button"
                    className="btn-cancelar"
                    onClick={() => setMostrarModal(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Produtos;
