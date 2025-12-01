import React, { useState, useEffect } from "react";
import "./css/listarVenda.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./navbar";
import jsPDF from "jspdf";
import MenuAcoes from "./menuAcoes.jsx";

export const ListarVendas = () => {
  const [vendas, setVendas] = useState([]);
  const [vendasGeral, setVendasGeral] = useState([]);
  const [busca, setBusca] = useState("");

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);

  const navigate = useNavigate();

  // ======================================================
  // STATE DO MODAL DE CONFIRMAÇÃO
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
    if (idParaExcluir) {
      excluirVenda(idParaExcluir);
    }
    fecharModal();
  };

  // ======================================================
  // GERAR PDF (mantive igual)
  // ======================================================
  const gerarPDFBrastalia = (dadosVenda) => {
    if (!dadosVenda) {
      toast.error("Erro: Dados da venda não carregados.");
      return;
    }

    const doc = new jsPDF();
    doc.setFillColor(75, 46, 42);
    doc.rect(0, 0, 210, 30, "F");
    doc.setFontSize(18);
    doc.setTextColor(245, 245, 245);
    doc.text("Brastália Café", 40, 20);
    doc.setFillColor(245, 237, 227);
    doc.rect(0, 30, 210, 267, "F");

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

    const dataRaw = dadosVenda.data_venda || dadosVenda.data;
    const dataObj = new Date(dataRaw);
    const dataFormatada = isNaN(dataObj)
      ? dataRaw
      : dataObj.toLocaleDateString("pt-BR");
    const totalRaw = dadosVenda.valor_total || dadosVenda.total || 0;
    const totalFormatado = parseFloat(totalRaw).toFixed(2);

    addInfo("Código", dadosVenda.id);
    const nomeCliente =
      dadosVenda.cliente?.razaoSocialEmpresa ||
      dadosVenda.cliente ||
      "Cliente Balcão";
    addInfo("Cliente", nomeCliente);
    addInfo("Data", dataFormatada);
    addInfo("Valor Total", `R$ ${totalFormatado}`);
    addInfo("Observação", dadosVenda.observacao || dadosVenda.obs || "-");

    y += 10;
    doc.setFontSize(14);
    doc.text("Itens do Pedido:", 14, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Produto", 16, y);
    doc.text("Qtd", 90, y);
    doc.text("Valor Un.", 130, y);
    doc.text("Total", 170, y);
    y += 4;
    doc.line(14, y, 196, y);
    y += 6;

    const listaItens = dadosVenda.itens || [];

    if (listaItens.length === 0) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Nenhum item registrado nesta venda.", 14, y);
    } else {
      listaItens.forEach((item, index) => {
        const linhaY = y;
        if (index % 2 === 0) {
          doc.setFillColor(220, 210, 200);
          doc.rect(14, linhaY - 5, 182, 8, "F");
        }
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);

        const nomeProduto = item.produto?.nome || "Produto s/ Info";
        const qtd = item.quantidade;
        const valorUn = parseFloat(item.valor_unitario || item.preco || 0);
        const subtotal = parseFloat(item.subtotal || qtd * valorUn);

        doc.text(String(nomeProduto).substring(0, 35), 16, linhaY);
        doc.text(String(qtd), 90, linhaY);
        doc.text(`R$ ${valorUn.toFixed(2)}`, 130, linhaY);
        doc.text(`R$ ${subtotal.toFixed(2)}`, 170, linhaY);
        y += 8;
      });
    }

    doc.setFillColor(75, 46, 42);
    doc.rect(0, 280, 210, 20, "F");
    doc.setFontSize(10);
    doc.setTextColor(245, 245, 245);
    doc.text("Brastália Café — Todos os direitos reservados", 14, 287);
    doc.text(`Emitido em: ${new Date().toLocaleDateString("pt-BR")}`, 140, 287);

    doc.save(`venda_${dadosVenda.id}.pdf`);
  };

  // ======================================================
  // BUSCAR VENDAS
  // ======================================================
  const fetchVendas = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/venda/Listar");
      const data = await response.json();
      const lista = Array.isArray(data.msg) ? data.msg : [];
      setVendas(lista);
    } catch {
      toast.error("Erro ao listar vendas");
    }
  };

  const fetchVendasGeral = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/venda/ListarGeral"
      );
      const data = await response.json();
      const lista = Array.isArray(data) ? data : [];
      setVendasGeral(lista);
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
    fetchVendasGeral();
  }, []);

  useEffect(() => {
    setPaginaAtual(1);
  }, [busca]);

  // ======================================================
  // FILTRAGEM + PAGINAÇÃO
  // ======================================================
  const vendasFiltradas = vendas.filter((v) => {
    const txt = busca.toLowerCase();
    return (
      String(v.id).toLowerCase().includes(txt) ||
      String(v.cliente || "")
        .toLowerCase()
        .includes(txt) ||
      String(v.data || "")
        .toLowerCase()
        .includes(txt)
    );
  });

  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const vendasAtuais = vendasFiltradas.slice(
    indexPrimeiroItem,
    indexUltimoItem
  );
  const totalPaginas = Math.ceil(vendasFiltradas.length / itensPorPagina);

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
          <>
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
                {vendasAtuais.map((venda) => (
                  <tr key={venda.id}>
                    <td>{venda.id}</td>
                    <td>{venda.cliente}</td>
                    <td>{venda.vendedor_id}</td>
                    <td>{venda.data}</td>
                    <td>R$ {parseFloat(venda.total).toFixed(2)}</td>
                    <td>{venda.obs || "-"}</td>
                    <td>
                      <MenuAcoes
                        onEditar={() => navigate(`/venda/editar/${venda.id}`)}
                        onExcluir={() => abrirModalExclusao(venda.id)}
                        onPDF={() => {
                          const vendaParaPDF = vendasGeral.find(
                            (v) => v.id === venda.id
                          );
                          vendaParaPDF
                            ? gerarPDFBrastalia(vendaParaPDF)
                            : toast.warning("Dados completos carregando...");
                        }}
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

              {Array.from({ length: totalPaginas }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setPaginaAtual(index + 1)}
                  className={`btn-paginacao ${
                    paginaAtual === index + 1 ? "ativo" : ""
                  }`}
                >
                  {index + 1}
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

      {/* ======================================================
          MODAL DE CONFIRMAÇÃO DE EXCLUSÃO
      ====================================================== */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">Confirmar Exclusão</div>

            <p>Tem certeza que deseja excluir esta venda?</p>

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

export default ListarVendas;
