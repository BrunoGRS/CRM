import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "./css/alocacoes.css";
import { Navbar } from "./navbar.jsx";

/*
  Nota sobre o logo:
  - Substitua o caminho abaixo pelo caminho/URL real se necessário.
  - Ambiente de desenvolvimento pode exigir ajuste (ex: import logo from "../assets/logo.png")
*/
const LOGO_PATH = "/mnt/data/221cb158-b210-4401-8874-a4ccff8956e4.png";

function Alocacao() {
  const [alocacoes, setAlocacoes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(false);
  const [busca, setBusca] = useState("");
  const [menuAberto, setMenuAberto] = useState(null);
  const [form, setForm] = useState({
    id: 0,
    maquina_id: "",
    cliente_id: "",
    data_inicio: "",
    data_fim: "",
    status: "",
    local_instalacao: "",
    responsavel_instalacao: "",
    observacoes: "",
  });

  const menuRef = useRef(null);
  const navigate = useNavigate();

  // fechar menu ao clicar fora
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // carregar dados
  const carregarAlocacoes = async () => {
    try {
      const resp = await fetch("http://localhost:3000/api/alocacao/listar");
      const dados = await resp.json();
      setAlocacoes(Array.isArray(dados) ? dados : []);
    } catch (err) {
      console.error("Erro carregar alocações", err);
    }
  };

  const carregarClientesEMaquinas = async () => {
    try {
      const [rc, rm] = await Promise.all([
        fetch("http://localhost:3000/api/cliente/listar"),
        fetch("http://localhost:3000/api/produto/listar"),
      ]);

      const cc = await rc.json();
      const mm = await rm.json();

      setClientes(Array.isArray(cc.msg) ? cc.msg : []);
      setMaquinas(Array.isArray(mm.msg) ? mm.msg : []);
    } catch (err) {
      console.error("Erro carregar clientes/maquinas", err);
    }
  };

  useEffect(() => {
    carregarAlocacoes();
    carregarClientesEMaquinas();
  }, []);

  const novaAlocacao = () => {
    setEditando(false);
    setForm({
      id: 0,
      maquina_id: "",
      cliente_id: "",
      data_inicio: "",
      data_fim: "",
      status: "",
      local_instalacao: "",
      responsavel_instalacao: "",
      observacoes: "",
    });
    setModalAberto(true);
  };

  const editarAlocacao = (a) => {
    setEditando(true);
    // garantir formato data yyyy-mm-dd se for string
    const dataIni = a.data_inicio ? a.data_inicio.slice(0, 10) : "";
    const dataFim = a.data_fim ? a.data_fim.slice(0, 10) : "";
    setForm({ ...a, data_inicio: dataIni, data_fim: dataFim });
    setModalAberto(true);
    setMenuAberto(null);
  };

  const salvar = async () => {
    try {
      const url = editando
        ? `http://localhost:3000/api/alocacao/editar/${form.id}`
        : "http://localhost:3000/api/alocacao/criar";
      const metodo = editando ? "PUT" : "POST";

      const body = {
        ...form,
        data_inicio: form.data_inicio || null,
        data_fim: form.data_fim || null,
      };

      const resp = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!resp.ok) throw new Error("Erro ao salvar");
      setModalAberto(false);
      carregarAlocacoes();
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar alocação");
    }
  };

  const excluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir?")) return;
    try {
      const resp = await fetch(
        `http://localhost:3000/api/alocacao/deletar/${id}`,
        { method: "DELETE" }
      );
      if (resp.ok) carregarAlocacoes();
    } catch (err) {
      console.error("Erro ao excluir", err);
    }
  };

  // geração de PDF (layout premium)
  const gerarPdfAlocacao = async (aloc) => {
    try {
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      // tentar carregar logo (se falhar continua sem)
      let imgData = null;
      try {
        await new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.onload = () => {
            // desenhar em canvas para obter base64
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            imgData = canvas.toDataURL("image/png");
            resolve(true);
          };
          img.onerror = () => {
            resolve(false);
          };
          img.src = LOGO_PATH; // aqui usamos o caminho local; adapte se necessário
        });
      } catch (e) {
        console.warn("Logo não carregada", e);
      }

      // cabeçalho
      doc.setFillColor(37, 64, 97);
      doc.rect(0, 0, pageWidth, 26, "F");
      if (imgData) {
        // mantemos margem e tamanho proporcional
        doc.addImage(imgData, "PNG", 14, 4, 36, 18);
      }
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text("Brastália Café", imgData ? 56 : 14, 16);

      // bloco info empresa (à direita)
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text("Rua Exemplo, 123 - Chapecó", pageWidth - 14, 9, {
        align: "right",
      });
      doc.text("Contato: (49) 99999-9999", pageWidth - 14, 15, {
        align: "right",
      });

      // área do conteúdo
      let cursor = 36;
      doc.setFillColor(245, 245, 245);
      doc.rect(10, cursor - 6, pageWidth - 20, 8, "F");
      doc.setTextColor(37, 64, 97);
      doc.setFontSize(12);
      doc.text("Resumo da Alocação", 14, cursor);

      cursor += 8;
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);

      const add = (label, value, yOffset = 7) => {
        doc.setFont(undefined, "bold");
        doc.text(`${label}:`, 14, cursor);
        doc.setFont(undefined, "normal");
        doc.text(String(value || "-"), 60, cursor);
        cursor += yOffset;
      };

      add("Código", aloc.id);
      add("Máquina", aloc.maquina_nome || aloc.maquina_id);
      add("Cliente", aloc.cliente_nome || aloc.cliente_id);
      add(
        "Período",
        `${aloc.data_inicio?.slice(0, 10) || "-"} → ${
          aloc.data_fim?.slice(0, 10) || "-"
        }`
      );
      add("Status", aloc.status);
      add("Local Instalação", aloc.local_instalacao || "-");
      add("Responsável", aloc.responsavel_instalacao || "-");
      // observações em bloco
      cursor += 4;
      doc.setFont(undefined, "bold");
      doc.text("Observações:", 14, cursor);
      doc.setFont(undefined, "normal");
      cursor += 6;

      const wrapText = doc.splitTextToSize(
        aloc.observacoes || "-",
        pageWidth - 28
      );
      doc.text(wrapText, 14, cursor);
      cursor += wrapText.length * 6 + 6;

      // rodapé com data e assinatura
      doc.setDrawColor(220);
      doc.line(14, 280, pageWidth - 14, 280);
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(`Emitido em: ${new Date().toLocaleString()}`, 14, 286);
      doc.text(
        "Assinatura: ____________________________",
        pageWidth - 14,
        286,
        { align: "right" }
      );

      // salvar
      doc.save(`alocacao_${aloc.id}.pdf`);
    } catch (err) {
      console.error("Erro gerar PDF", err);
      alert("Erro ao gerar PDF");
    }
  };

  const alocacoesFiltradas = alocacoes.filter((a) => {
    const t = busca.toLowerCase();
    return (
      String(a.id).includes(t) ||
      (a.cliente_nome || "").toLowerCase().includes(t) ||
      (a.maquina_nome || "").toLowerCase().includes(t) ||
      (a.status || "").toLowerCase().includes(t) ||
      (a.local_instalacao || "").toLowerCase().includes(t)
    );
  });

  return (
    <div className="aloc-container">
      <Navbar />

      <div className="aloc-header">
        <h1>📦 Alocações de Máquina</h1>
        <div className="aloc-actions-right">
          <button className="btn-add" onClick={novaAlocacao}>
            + Nova Alocação
          </button>
        </div>
      </div>

      <div className="search-row">
        <input
          className="input-busca"
          placeholder="Buscar por Cliente, Máquina ou Status..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      <table className="aloc-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Máquina</th>
            <th>Cliente</th>
            <th>Início</th>
            <th>Fim</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {alocacoesFiltradas.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.maquina_nome || a.maquina_id}</td>
              <td>{a.cliente_nome || a.cliente_id}</td>
              <td>{a.data_inicio?.slice(0, 10) || "-"}</td>
              <td>{a.data_fim?.slice(0, 10) || "-"}</td>
              <td>
                <span className={`status-badge status-${a.status}`}>
                  {a.status}
                </span>
              </td>

              <td className="acoes-col">
                <div className="menu-wrapper" ref={menuRef}>
                  <button
                    className="menu-trigger"
                    onClick={() =>
                      setMenuAberto(menuAberto === a.id ? null : a.id)
                    }
                    aria-label="Ações"
                  >
                    ⋮
                  </button>

                  {menuAberto === a.id && (
                    <div className="menu-dropdown">
                      <button onClick={() => editarAlocacao(a)}>
                        ✏ Editar
                      </button>
                      <button onClick={() => excluir(a.id)}>🗑 Excluir</button>
                      <button onClick={() => gerarPdfAlocacao(a)}>
                        📄 Gerar PDF
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {alocacoesFiltradas.length === 0 && (
            <tr>
              <td colSpan="7" className="no-results">
                Nenhuma alocação encontrada
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL */}
      {modalAberto && (
        <div className="modal-bg">
          <div className="modal">
            <h2>{editando ? "Editar Alocação" : "Nova Alocação"}</h2>

            <div className="modal-body-scroll">
              <div className="form-grid">
                <label>Máquina</label>
                <select
                  value={form.maquina_id}
                  onChange={(e) =>
                    setForm({ ...form, maquina_id: e.target.value })
                  }
                >
                  <option value="">Selecione...</option>
                  {maquinas.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome}
                    </option>
                  ))}
                </select>

                <label>Cliente</label>
                <select
                  value={form.cliente_id}
                  onChange={(e) =>
                    setForm({ ...form, cliente_id: e.target.value })
                  }
                >
                  <option value="">Selecione...</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.razaoSocialEmpresa}
                    </option>
                  ))}
                </select>

                <label>Data Início</label>
                <input
                  type="date"
                  value={form.data_inicio?.slice(0, 10)}
                  onChange={(e) =>
                    setForm({ ...form, data_inicio: e.target.value })
                  }
                />

                <label>Data Fim</label>
                <input
                  type="date"
                  value={form.data_fim?.slice(0, 10)}
                  onChange={(e) =>
                    setForm({ ...form, data_fim: e.target.value })
                  }
                />

                <label>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="">Selecione...</option>
                  <option value="ativa">Ativa</option>
                  <option value="encerrada">Encerrada</option>
                  <option value="em_manutencao">Em manutenção</option>
                  <option value="reservada">Reservada</option>
                </select>

                <label>Local Instalação</label>
                <input
                  type="text"
                  value={form.local_instalacao}
                  onChange={(e) =>
                    setForm({ ...form, local_instalacao: e.target.value })
                  }
                />

                <label>Responsável</label>
                <input
                  type="text"
                  value={form.responsavel_instalacao}
                  onChange={(e) =>
                    setForm({ ...form, responsavel_instalacao: e.target.value })
                  }
                />

                <label>Observações</label>
                <textarea
                  value={form.observacoes}
                  onChange={(e) =>
                    setForm({ ...form, observacoes: e.target.value })
                  }
                ></textarea>
              </div>
            </div>

            <div className="modal-buttons">
              <button className="btn-save" onClick={salvar}>
                Salvar
              </button>
              <button
                className="btn-cancel"
                onClick={() => setModalAberto(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Alocacao;
