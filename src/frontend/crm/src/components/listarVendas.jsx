import React, { useState, useEffect } from "react";
import "./css/listarVenda.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./navbar";

export const ListarVendas = () => {
  const [vendas, setVendas] = useState([]);
  const [busca, setBusca] = useState(""); // ← FILTRO
  const navigate = useNavigate();

  const fetchVendas = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/venda/listar");
      const data = await response.json();

      const lista = Array.isArray(data.msg) ? data.msg : [];
      setVendas(lista);
    } catch {
      toast.error("Erro ao listar vendas");
    }
  };

  const excluirVenda = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/venda/delete/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        toast.success("Venda excluída com sucesso!");
        fetchVendas();
      } else {
        toast.error("Erro ao excluir venda");
      }
    } catch {
      toast.error("Erro ao excluir venda");
    }
  };

  useEffect(() => {
    fetchVendas();
  }, []);

  // 🔥 FILTRO FUNCIONAL
  const vendasFiltradas = vendas.filter((v) => {
    const txt = busca.toLowerCase();

    return (
      String(v.Codigo).toLowerCase().includes(txt) ||
      String(v.Cliente || "")
        .toLowerCase()
        .includes(txt) ||
      String(v.vendedor_id || "")
        .toLowerCase()
        .includes(txt) ||
      String(v.Data || "")
        .toLowerCase()
        .includes(txt) ||
      String(v.Total || "")
        .toLowerCase()
        .includes(txt) ||
      String(v.Obs || "")
        .toLowerCase()
        .includes(txt)
    );
  });

  return (
    <div className="layout">
      <Navbar />
      <main className="content">
        <h2>Lista de Vendas</h2>

        <button
          className="btn-criar-novo"
          onClick={() => navigate("/venda/nova")}
        >
          + Nova Venda
        </button>

        {/* 🔍 INPUT DE BUSCA */}
        <input
          type="text"
          className="input-busca"
          placeholder="Buscar por código, cliente, vendedor..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        {vendasFiltradas.length === 0 ? (
          <p>Nenhuma venda encontrada.</p>
        ) : (
          <table className="venda-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Vendedor</th>
                <th>Data da Venda</th>
                <th>Valor Total</th>
                <th>Observação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {vendasFiltradas.map((venda) => (
                <tr key={venda.Codigo}>
                  <td>{venda.Codigo}</td>
                  <td>{venda.Cliente}</td>
                  <td>{venda.vendedor_id}</td>
                  <td>{venda.Data}</td>
                  <td>R$ {parseFloat(venda.Total).toFixed(2)}</td>
                  <td>{venda.Obs || "-"}</td>
                  <td>
                    <button
                      className="button-editar"
                      onClick={() => navigate(`/venda/editar/${venda.Codigo}`)}
                    >
                      Editar
                    </button>
                    <button
                      className="button-excluir"
                      onClick={() => excluirVenda(venda.Codigo)}
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

export default ListarVendas;
