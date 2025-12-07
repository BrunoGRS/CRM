import React, { useState, useEffect } from "react";
import "./css/usuario.css";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Navbar } from "./navbar";
import MenuAcoesSemPDF from "./menuAcoesSemPdf.jsx";

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

  const [isCriar, setIsCriar] = useState(true);
  const [produtoId, setProdutoId] = useState("");

  // MODAIS
  const [mostrarModal, setMostrarModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ==========================
  // PAGINAÇÃO
  // ==========================
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  // Busca (se quiser adicionar depois)
  const [busca, setBusca] = useState("");

  const filtrar = (p) => {
    const t = busca.toLowerCase();
    return (
      p.id.toString().includes(t) ||
      p.nome?.toLowerCase().includes(t) ||
      p.preco?.toString().includes(t) ||
      p.estoque?.toString().includes(t)
    );
  };

  const dadosFiltrados = produtos.filter(filtrar);
  const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  const exibidos = dadosFiltrados.slice(inicio, fim);

  // ===============================
  // BUSCAR LISTA
  // ===============================
  const fetchProdutos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/produto/listar");
      const inf = await response.json();
      const lista = Array.isArray(inf.msg) ? inf.msg : [];
      setProdutos(lista);
    } catch {
      toast.error("Erro ao listar produtos");
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  // ===============================
  // CRIAR
  // ===============================
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
        setMostrarModal(false);
        fetchProdutos();
      } else {
        toast.error("Erro ao criar produto");
      }
    } catch {
      toast.error("Erro ao criar produto");
    }
  };

  // ===============================
  // EDITAR
  // ===============================
  const editarProduto = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/produto/editar/${produtoId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.status === 200) {
        toast.success("Produto atualizado!");
        setMostrarModal(false);
        fetchProdutos();
      } else {
        toast.error("Erro ao atualizar produto");
      }
    } catch {
      toast.error("Erro ao atualizar produto");
    }
  };

  // ===============================
  // EXCLUIR
  // ===============================
  const deletar = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/produto/delete/${deleteId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        toast.success("Produto excluído!");
        fetchProdutos();
        setDeleteId(null);
      } else {
        toast.error("Erro ao excluir produto");
      }
    } catch {
      toast.error("Erro ao excluir produto");
    }
  };

  return (
    <div className="layout">
      <Navbar />

      <main className="content">
        <h2>Gerenciamento de Produtos</h2>

        {/* AÇÕES SUPERIORES */}
        <div className="top-actions">
          <button
            className="btn-criar-novo"
            onClick={() => {
              setIsCriar(true);
              setFormData({
                nome: "",
                preco: "",
                estoque: "",
                categoria_id: "",
                marca_id: "",
              });
              setMostrarModal(true);
            }}
          >
            + Novo Produto
          </button>

          {/* Campo de busca */}
          <input
            className="campo-busca"
            type="text"
            placeholder="Buscar produtos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* TABELA */}
        {exibidos.length === 0 ? (
          <p>Nenhum produto encontrado.</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <td>Código</td>
                <td>Nome</td>
                <td>Preço</td>
                <td>Estoque</td>
                <td>Ações</td>
              </tr>
            </thead>

            <tbody>
              {exibidos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nome}</td>
                  <td>{p.preco}</td>
                  <td>{p.estoque}</td>
                  <td>
                    <MenuAcoesSemPDF
                      onEditar={() => {
                        setIsCriar(false);
                        setProdutoId(p.id);
                        setFormData({
                          nome: p.nome,
                          preco: p.preco,
                          estoque: p.estoque,
                          categoria_id: p.categoria_id || "",
                          marca_id: p.marca_id || "",
                        });
                        setMostrarModal(true);
                      }}
                      onExcluir={() => setDeleteId(p.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* PAGINAÇÃO */}
        <div className="paginacao">
          <button
            disabled={paginaAtual === 1}
            onClick={() => setPaginaAtual((p) => p - 1)}
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
            disabled={paginaAtual === totalPaginas}
            onClick={() => setPaginaAtual((p) => p + 1)}
          >
            Próxima
          </button>
        </div>

        {/* MODAL CONFIRMAR EXCLUSÃO */}
        {deleteId && (
          <div className="modal-overlay">
            <div className="modal-container">
              <h2 className="modal-header">Confirmar Exclusão</h2>

              <p>Tem certeza que deseja excluir este produto?</p>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteId(null)}
                >
                  Cancelar
                </button>

                <button className="btn btn-danger" onClick={deletar}>
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL FORM */}
        {mostrarModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{isCriar ? "Novo Produto" : "Editar Produto"}</h3>
                <button
                  className="modal-close"
                  onClick={() => setMostrarModal(false)}
                >
                  ×
                </button>
              </div>

              <form
                className="produto-form"
                onSubmit={isCriar ? criarProduto : editarProduto}
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

                <div className="botoes-form">
                  <button type="submit">
                    {isCriar ? "Salvar Produto" : "Salvar Alterações"}
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
