import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./navbar.jsx";
import MenuAcoes from "./menuAcoes.jsx";
import "./css/alocacoes.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ListaAlocacoes = () => {
  const navigate = useNavigate();
  const [alocacoes, setAlocacoes] = useState([]);
  const [busca, setBusca] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const carregarAlocacoes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/alocacao/listar");
      const data = await response.json();
      setAlocacoes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar alocações:", error);
    }
  };

  useEffect(() => {
    carregarAlocacoes();
  }, []);

  useEffect(() => {
    setPaginaAtual(1);
  }, [busca]);

  const filtrar = (item) => {
    const texto = busca.toLowerCase();
    return (
      item.id.toString().includes(texto) ||
      item.cliente?.toLowerCase().includes(texto) ||
      item.maquina?.toLowerCase().includes(texto) ||
      item.status?.toLowerCase().includes(texto)
    );
  };

  const listaFiltrada = alocacoes.filter(filtrar);

  const indexUltimo = paginaAtual * itensPorPagina;
  const indexPrimeiro = indexUltimo - itensPorPagina;
  const listaAtual = listaFiltrada.slice(indexPrimeiro, indexUltimo);
  const totalPaginas = Math.ceil(listaFiltrada.length / itensPorPagina);

  const gerarPDF = (aloc) => {
    const doc = new jsPDF();

    const marrom = "#4B2E1E";

    doc.setFillColor(marrom);
    doc.rect(0, 0, 210, 30, "F");

    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("Relatório de Alocação de Máquina", 14, 18);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text(`Alocação #${aloc.id}`, 14, 45);

    autoTable(doc, {
      startY: 55,
      head: [["Campo", "Detalhes"]],
      headStyles: {
        fillColor: marrom,
        textColor: 255,
        halign: "center",
      },
      body: [
        ["Máquina", aloc.maquina || "-"],
        ["Cliente", aloc.cliente || "-"],
        ["Data Início", aloc.data_inicio || "-"],
        ["Data Fim", aloc.data_fim || "-"],
        ["Status", aloc.status || "-"],
      ],
      styles: { fontSize: 11, cellPadding: 4 },
      theme: "grid",
    });

    doc.save(`alocacao_${aloc.id}.pdf`);
  };

  const deletar = async () => {
    try {
      await fetch(`http://localhost:3000/api/alocacao/delete/${deleteId}`, {
        method: "DELETE",
      });

      setDeleteId(null);
      carregarAlocacoes();
    } catch (error) {
      console.error("Erro ao excluir alocação:", error);
    }
  };

  const exportarCSV = () => {
    if (!alocacoes.length) {
      alert("Nenhuma alocação encontrada para exportar.");
      return;
    }

    const cabecalho = [
      "ID",
      "Máquina",
      "Cliente",
      "Data Início",
      "Data Fim",
      "Status",
    ];

    const linhas = alocacoes.map((item) => [
      item.id,
      item.maquina || "",
      item.cliente || "",
      item.data_inicio || "",
      item.data_fim || "",
      item.status || "",
    ]);

    const csvString = [cabecalho, ...linhas]
      .map((linha) => linha.map((col) => `"${col}"`).join(","))
      .join("\n");

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "alocacoes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="lista-container">
      <Navbar />

      <main className="content">
        <h1 className="titulo">Lista de Alocações</h1>

        <div className="top-actions">
          <div>
            <button
              className="btn-novo"
              onClick={() => navigate("/alocacao/nova")}
            >
              + Nova Alocação
            </button>

            <button className="btn-exportar" onClick={exportarCSV}>
              📄 Exportar CSV
            </button>
          </div>
        </div>

        <input
          type="text"
          className="campo-busca"
          placeholder="Buscar por código, cliente, máquina..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <table className="tabela">
          <thead>
            <tr>
              <th>CÓDIGO</th>
              <th>MÁQUINA</th>
              <th>CLIENTE</th>
              <th>INÍCIO</th>
              <th>FIM</th>
              <th>STATUS</th>
              <th>AÇÕES</th>
            </tr>
          </thead>

          <tbody>
            {listaAtual.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.maquina}</td>
                <td>{item.cliente}</td>
                <td>{item.data_inicio}</td>
                <td>{item.data_fim || "-"}</td>
                <td>{item.status?.toUpperCase()}</td>

                <td>
                  <MenuAcoes
                    onEditar={() => navigate(`/alocacao/editar/${item.id}`)}
                    onExcluir={() => setDeleteId(item.id)}
                    onPDF={() => gerarPDF(item)}
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
      </main>

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-header">Confirmar Exclusão</h2>

            <p>Tem certeza que deseja excluir esta alocação?</p>

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
    </div>
  );
};

export default ListaAlocacoes;
