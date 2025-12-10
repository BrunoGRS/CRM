import React, { useState, useEffect } from "react";
import "./css/usuario.css";
import { toast } from "react-toastify";
import { Navbar } from "./navbar";
import MenuAcoesSemPDF from "./menuAcoesSemPdf.jsx";

export const Produtos = () => {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);

  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
    estoque: "",
    categoria_id: "",
    marca_id: "",
  });

  const [isCriar, setIsCriar] = useState(true);
  const [produtoId, setProdutoId] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchProdutos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/produto/listar");
      const data = await response.json();
      const lista = Array.isArray(data.msg) ? data.msg : [];
      setProdutos(lista);
    } catch {
      toast.error("Erro ao listar produtos");
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  useEffect(() => {
    setPaginaAtual(1);
  }, [busca]);

  // ===============================
  // FILTRO
  // ===============================
  const listaFiltrada = produtos.filter((p) => {
    const txt = busca.toLowerCase();
    return (
      String(p.id).includes(txt) ||
      (p.nome || "").toLowerCase().includes(txt) ||
      String(p.preco || "").includes(txt) ||
      String(p.estoque || "").includes(txt)
    );
  });

  // ===============================
  // PAGINAÇÃO (IGUAL MANUTENÇÕES)
  // ===============================
  const indexUltimo = paginaAtual * itensPorPagina;
  const indexPrimeiro = indexUltimo - itensPorPagina;
  const listaAtual = listaFiltrada.slice(indexPrimeiro, indexUltimo);
  const totalPaginas = Math.ceil(listaFiltrada.length / itensPorPagina);

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

  const deletar = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/produto/delete/${deleteId}`,
        { method: "DELETE" }
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
        </div>

        {listaFiltrada.length === 0 ? (
          <p>Nenhum produto encontrado.</p>
        ) : (
          <>
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
                {listaAtual.map((p) => (
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
