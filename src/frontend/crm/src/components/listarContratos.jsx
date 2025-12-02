import React, { useState, useEffect } from "react";
import "./css/listarVenda.css"; // pode renomear depois se quiser
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./navbar.jsx";
import jsPDF from "jspdf";
import MenuAcoes from "./menuAcoes.jsx";

export const ListarContratos = () => {
  const [contratos, setContratos] = useState([]);
  const [contratosGeral, setContratosGeral] = useState([]);
  const [busca, setBusca] = useState("");

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);

  const navigate = useNavigate();

  // ======================================================
  // MODAL
  // ======================================================
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

  // ======================================================
  // GERAR PDF — versão simplificada para CONTRATOS
  // ======================================================
  const gerarPDFContrato = (contrato) => {
    if (!contrato) {
      toast.error("Erro: Dados do contrato não carregados.");
      return;
    }

    const doc = new jsPDF();

    // Cabeçalho
    doc.setFillColor(50, 50, 50);
    doc.rect(0, 0, 210, 25, "F");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("Contrato - Registro", 14, 16);

    let y = 40;

    const addLine = (label, value) => {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`${label}:`, 14, y);
      doc.setFont("helvetica", "bold");
      doc.text(String(value ?? "-"), 60, y);
      doc.setFont("helvetica", "normal");
      y += 8;
    };

    addLine("Código", contrato.id);
    addLine("Cliente", contrato.cliente_nome);
    addLine("CPF/CNPJ", contrato.cliente_documento);
    addLine("Data Início", contrato.data_inicio);
    addLine("Data Fim", contrato.data_fim || "-");
    addLine("Valor Mensal", `R$ ${Number(contrato.valor_mensal).toFixed(2)}`);
    addLine("Desc. do Serviço", contrato.descricao_servico);
    addLine("Observações", contrato.observacao || "-");

    doc.save(`contrato_${contrato.id}.pdf`);
  };

  // ======================================================
  // BUSCAR CONTRATOS
  // ======================================================
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

  // ======================================================
  // FILTRAGEM + PAGINAÇÃO
  // ======================================================
  const contratosFiltrados = contratos.filter((c) => {
    const txt = busca.toLowerCase();
    return (
      String(c.id).includes(txt) ||
      String(c.cliente_nome || "")
        .toLowerCase()
        .includes(txt) ||
      String(c.data_inicio || "")
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

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <div className="layout">
      <Navbar />

      <main className="content">
        <h2>Lista de Contratos</h2>

        <button
          className="btn-criar-novo"
          onClick={() => navigate("/contrato/nova")}
        >
          + Novo Contrato
        </button>

        <input
          type="text"
          className="input-busca"
          placeholder="Buscar por código, cliente ou data..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        {contratosFiltrados.length === 0 ? (
          <p>Nenhum contrato encontrado.</p>
        ) : (
          <>
            <table className="venda-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Cliente</th>
                  <th>CPF/CNPJ</th>
                  <th>Data Início</th>
                  <th>Valor Mensal</th>
                  <th>Observações</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {contratosAtuais.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.cliente_nome}</td>
                    <td>{c.cliente_documento}</td>
                    <td>{c.data_inicio}</td>
                    <td>R$ {Number(c.valor_mensal).toFixed(2)}</td>
                    <td>{c.observacao || "-"}</td>

                    <td>
                      <MenuAcoes
                        onEditar={() => navigate(`/contrato/editar/${c.id}`)}
                        onExcluir={() => abrirModalExclusao(c.id)}
                        onPDF={() => {
                          const dados = contratosGeral.find(
                            (x) => x.id === c.id
                          );
                          dados
                            ? gerarPDFContrato(dados)
                            : toast.warning("Carregando dados...");
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* paginação */}
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
