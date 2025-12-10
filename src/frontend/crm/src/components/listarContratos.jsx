import React, { useState, useEffect } from "react";
import "./css/listarVenda.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./navbar.jsx";
import jsPDF from "jspdf";
import MenuAcoes from "./menuAcoes.jsx";

export const ListarContratos = () => {
  const [contratos, setContratos] = useState([]);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);

  const navigate = useNavigate();

  const [modalAberto, setModalAberto] = useState(false);
  const [idParaExcluir, setIdParaExcluir] = useState(null);

  const abrirModalExclusao = (id) => {
    setIdParaExcluir(id);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setIdParaExcluir(null);
  };

  const confirmarExclusao = () => {
    if (idParaExcluir) excluirContrato(idParaExcluir);
    fecharModal();
  };

  // ===============================
  // EXPORTAR CSV
  // ===============================
  const exportarCSV = () => {
    if (!contratos.length) {
      return toast.warn("Nenhum contrato para exportar.");
    }

    const cabecalho = [
      "Código",
      "Cliente",
      "Número Contrato",
      "Título",
      "Tipo",
      "Data Início",
      "Data Fim",
      "Valor Total",
      "Status",
    ];

    const linhas = contratos.map((c) => [
      c.id,
      c.cliente || "",
      c.numero_contrato || "",
      c.titulo || "",
      c.tipo_contrato || "",
      c.inicio || "",
      c.fim || "",
      c.valor_total || "",
      c.status || "",
    ]);

    const csv = [cabecalho, ...linhas]
      .map((l) => l.map((i) => `"${i}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "contratos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ===============================
  // PDF
  // ===============================
  const gerarPDFContrato = (contrato) => {
    if (!contrato) {
      toast.error("Erro ao gerar PDF.");
      return;
    }

    const doc = new jsPDF();

    doc.setFillColor(40, 40, 40);
    doc.rect(0, 0, 210, 20, "F");

    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("Contrato - Registro Completo", 10, 13);

    let y = 35;

    const titulo = (t) => {
      doc.setFontSize(14);
      doc.setTextColor(30, 30, 30);
      doc.text(t, 10, y);
      y += 8;
    };

    const linha = (label, value) => {
      doc.setFontSize(11);
      doc.setTextColor(70, 70, 70);
      doc.text(`${label}:`, 10, y);
      doc.setTextColor(20, 20, 20);
      doc.text(String(value || "-"), 60, y);
      y += 7;
    };

    titulo("Dados do Contrato");
    linha("Código", contrato.id);
    linha("Cliente", contrato.cliente);
    linha("Número", contrato.numero_contrato);
    linha("Título", contrato.titulo);
    linha("Tipo", contrato.tipo_contrato);

    doc.line(10, y, 200, y);
    y += 8;

    titulo("Datas");
    linha("Início", contrato.inicio);
    linha("Fim", contrato.fim);

    doc.line(10, y, 200, y);
    y += 8;

    titulo("Valores");
    linha("Valor Total", `R$ ${Number(contrato.valor_total).toFixed(2)}`);

    doc.line(10, y, 200, y);
    y += 8;

    titulo("Status");
    linha("Status", contrato.status);

    doc.save(`contrato_${contrato.id}.pdf`);
  };

  const fetchContratos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/contrato/listar");
      const data = await response.json();
      setContratos(Array.isArray(data.msg) ? data.msg : []);
    } catch {
      toast.error("Erro ao listar contratos");
    }
  };

  const excluirContrato = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/contrato/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 200) {
        toast.success("Contrato excluído com sucesso!");
        fetchContratos();
      } else {
        toast.error("Erro ao excluir contrato");
      }
    } catch {
      toast.error("Erro ao excluir contrato");
    }
  };

  useEffect(() => {
    fetchContratos();
  }, []);

  useEffect(() => {
    setPaginaAtual(1);
  }, [busca]);

  const contratosFiltrados = contratos.filter((c) => {
    const txt = busca.toLowerCase();
    return (
      String(c.id).includes(txt) ||
      String(c.cliente || "")
        .toLowerCase()
        .includes(txt) ||
      String(c.inicio || "")
        .toLowerCase()
        .includes(txt)
    );
  });

  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;

  const contratosAtuais = contratosFiltrados.slice(
    indexPrimeiroItem,
    indexUltimoItem
  );

  const totalPaginas = Math.ceil(contratosFiltrados.length / itensPorPagina);

  return (
    <div className="layout">
      <Navbar />

      <main className="content">
        <h2>Lista de Contratos</h2>

        {/* TOPO PADRÃO MANUTENÇÃO */}
        <div className="topo-acoes">
          <div>
            <button
              className="btn-criar-novo"
              onClick={() => navigate("/contrato/nova")}
            >
              + Novo Contrato
            </button>

            <button className="btn-exportar" onClick={exportarCSV}>
              📄 Exportar CSV
            </button>
          </div>

          <input
            type="text"
            className="input-busca"
            placeholder="Buscar por código, cliente ou data..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {contratosFiltrados.length === 0 ? (
          <p>Nenhum contrato encontrado.</p>
        ) : (
          <>
            <table className="venda-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Cliente</th>
                  <th>Tipo de Contrato</th>
                  <th>Data Início</th>
                  <th>Valor Total</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {contratosAtuais.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.cliente}</td>
                    <td>{c.tipo_contrato}</td>
                    <td>{c.inicio}</td>
                    <td>R$ {Number(c.valor_total)}</td>
                    <td>{c.status?.toUpperCase()}</td>

                    <td>
                      <MenuAcoes
                        onEditar={() => navigate(`/contrato/editar/${c.id}`)}
                        onExcluir={() => abrirModalExclusao(c.id)}
                        onPDF={() => gerarPDFContrato(c)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINAÇÃO */}
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
                  onClick={() => setPaginaAtual(i + 1)}
                  className={`btn-paginacao ${
                    paginaAtual === i + 1 ? "ativo" : ""
                  }`}
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
      </main>

      {/* MODAL */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">Confirmar Exclusão</div>

            <p>Tem certeza que deseja excluir este contrato?</p>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={fecharModal}>
                Cancelar
              </button>

              <button className="btn btn-danger" onClick={confirmarExclusao}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListarContratos;
