import React, { useState, useEffect } from "react";
import "./css/listarVenda.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./navbar";

export const ListarVendas = () => {
  const [vendas, setVendas] = useState([]);
  const navigate = useNavigate();

  const fetchVendas = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/venda/listar");
      const data = await response.json();
      const lista = Array.isArray(data.msg) ? data.msg : [];
      console.log(lista);
      setVendas(lista);
    } catch {
      toast.error("Erro ao listar vendas");
    }
  };

  const excluirVenda = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta venda?")) return;

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

        {vendas.length === 0 ? (
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
              {vendas.map((venda) => (
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
                      onClick={() => excluirVenda(venda.id)}
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
