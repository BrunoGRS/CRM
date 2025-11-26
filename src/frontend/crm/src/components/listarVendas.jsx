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
  const [itensPorPagina] = useState(10); // Exibe 10 itens por vez

  const navigate = useNavigate();

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

  // Resetar para página 1 quando fizer uma busca nova
  useEffect(() => {
    setPaginaAtual(1);
  }, [busca]);

  // ======================================================
  // LÓGICA DE FILTRO E PAGINAÇÃO
  // ======================================================

  // 1. Primeiro filtra
  const vendasFiltradas = vendas.filter((v) => {
    const txt = busca.toLowerCase();
    return (
      String(v.id).toLowerCase().includes(txt) || // Ajustado de 'codigo' para 'id'
      String(v.cliente || "")
        .toLowerCase()
        .includes(txt) ||
      String(v.data || "")
        .toLowerCase()
        .includes(txt)
    );
  });

  // 2. Calcula índices para paginação
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;

  // 3. Faria os itens que vão aparecer NA TELA AGORA
  const vendasAtuais = vendasFiltradas.slice(
    indexPrimeiroItem,
    indexUltimoItem
  );

  // 4. Calcula total de páginas
  const totalPaginas = Math.ceil(vendasFiltradas.length / itensPorPagina);

  // 5. Função para mudar página
  const mudarPagina = (numeroPagina) => setPaginaAtual(numeroPagina);

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
                {/* Usamos 'vendasAtuais' em vez de 'vendasFiltradas' aqui */}
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
                        onExcluir={() => excluirVenda(venda.id)}
                        onPDF={() => {
                          const vendaParaPDF = vendasGeral.find(
                            (v) => v.id === venda.id
                          );
                          if (vendaParaPDF) {
                            gerarPDFBrastalia(vendaParaPDF);
                          } else {
                            toast.warning("Dados completos carregando...");
                          }
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* --- COMPONENTE DE PAGINAÇÃO --- */}
            <div
              className="paginacao-container"
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <button
                onClick={() => mudarPagina(paginaAtual - 1)}
                disabled={paginaAtual === 1}
                className="btn-paginacao"
              >
                Anterior
              </button>

              {Array.from({ length: totalPaginas }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => mudarPagina(index + 1)}
                  className={`btn-paginacao ${
                    paginaAtual === index + 1 ? "ativo" : ""
                  }`}
                  style={{
                    fontWeight: paginaAtual === index + 1 ? "bold" : "normal",
                    backgroundColor:
                      paginaAtual === index + 1 ? "#4b2e2a" : "#ddd",
                    color: paginaAtual === index + 1 ? "#fff" : "#000",
                  }}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => mudarPagina(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
                className="btn-paginacao"
              >
                Próximo
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ListarVendas;
