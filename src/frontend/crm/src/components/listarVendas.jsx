import React, { useState, useEffect } from "react";
import "./css/listarVenda.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./navbar";
import jsPDF from "jspdf";
import MenuAcoes from "./menuAcoes.jsx";

export const ListarVendas = () => {
  const [vendas, setVendas] = useState([]);
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();

  // ======================================================
  // GERAR PDF COM LAYOUT BRASTÁLIA
  // ======================================================
  const gerarPDFBrastalia = (venda) => {
    const doc = new jsPDF();

    // Cabeçalho
    doc.setFillColor(75, 46, 42);
    doc.rect(0, 0, 210, 30, "F");

    doc.setFontSize(18);
    doc.setTextColor(245, 245, 245);
    doc.text("Brastália Café", 40, 20);

    // Fundo do conteúdo
    doc.setFillColor(245, 237, 227);
    doc.rect(0, 30, 210, 250, "F");

    // Informações
    let y = 45;
    const addInfo = (label, value) => {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`${label}:`, 14, y);
      doc.setFont("helvetica", "bold");
      doc.text(String(value), 60, y);
      doc.setFont("helvetica", "normal");
      y += 8;
    };

    doc.setFontSize(14);
    doc.text("Informações da Venda", 14, y);
    y += 10;

    addInfo("Código", venda.Codigo);
    addInfo("Cliente", venda.Cliente);
    addInfo("Data", venda.Data);
    addInfo("Valor Total", `R$ ${parseFloat(venda.Total).toFixed(2)}`);
    addInfo("Observação", venda.Obs || "-");

    // Tabela de itens
    y += 10;
    doc.setFontSize(14);
    doc.text("Itens do Pedido:", 14, y);
    y += 6;

    if (!venda.itens || venda.itens.length === 0) {
      doc.setFontSize(12);
      doc.text("Nenhum item encontrado.", 14, y);
    } else {
      venda.itens.forEach((item, index) => {
        const linhaY = y + index * 8;

        if (index % 2 === 0) {
          doc.setFillColor(220, 210, 200);
          doc.rect(14, linhaY - 4, 182, 8, "F");
        }

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(String(item.produto), 16, linhaY);
        doc.text(String(item.quantidade), 90, linhaY);
        doc.text(`R$ ${Number(item.preco).toFixed(2)}`, 130, linhaY);
        doc.text(
          `R$ ${(item.quantidade * item.preco).toFixed(2)}`,
          170,
          linhaY
        );
      });
    }

    // Rodapé
    doc.setFillColor(75, 46, 42);
    doc.rect(0, 280, 210, 20, "F");
    doc.setFontSize(10);
    doc.setTextColor(245, 245, 245);
    doc.text("Brastália Café — Todos os direitos reservados", 14, 287);
    doc.text(`Emitido em: ${new Date().toLocaleDateString()}`, 140, 287);

    doc.save(`venda_${venda.Codigo}.pdf`);
  };

  // ======================================================
  // BUSCAR VENDAS
  // ======================================================
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

  // ======================================================
  // FILTRO
  // ======================================================
  const vendasFiltradas = vendas.filter((v) => {
    const txt = busca.toLowerCase();
    return (
      String(v.Codigo).toLowerCase().includes(txt) ||
      String(v.Cliente || "")
        .toLowerCase()
        .includes(txt) ||
      String(v.Data || "")
        .toLowerCase()
        .includes(txt)
    );
  });

  // ======================================================
  // RENDER
  // ======================================================
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

        <input
          type="text"
          className="input-busca"
          placeholder="Buscar por código, cliente ou data..."
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
                <th>Data</th>
                <th>Total</th>
                <th>Obs</th>
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
                    <MenuAcoes
                      onEditar={() => navigate(`/venda/editar/${venda.Codigo}`)}
                      onExcluir={() => excluirVenda(venda.Codigo)}
                      onPDF={() => gerarPDFBrastalia(venda)}
                    />
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
