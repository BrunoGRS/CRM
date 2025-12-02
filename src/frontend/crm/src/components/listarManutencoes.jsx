import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./css/listarManutencoes.css";
import { Navbar } from "./navbar";
import MenuAcoes from "./menuAcoes.jsx";

export const ListarManutencoes = () => {
  const [manutencoes, setManutencoes] = useState([]);
  const [busca, setBusca] = useState("");

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);

  const [idParaExcluir, setIdParaExcluir] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);

  const navigate = useNavigate();

  // Buscar lista
  const fetchManutencoes = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/manutencao/listarGeral"
      );

      const data = await response.json();
      const lista = Array.isArray(data.msg) ? data.msg : [];

      setManutencoes(lista);
      console.log(data);
    } catch (error) {
      toast.error("Erro ao listar manutenções");
    }
  };

  useEffect(() => {
    fetchManutencoes();
  }, []);

  useEffect(() => {
    setPaginaAtual(1);
  }, [busca]);

  // FILTRO
  const listaFiltrada = manutencoes.filter((m) => {
    const txt = busca.toLowerCase();
    return (
      String(m.id).includes(txt) ||
      String(m.equipamento_id).includes(txt) ||
      (m.tipo_manutencao || "").toLowerCase().includes(txt) ||
      (m.status || "").toLowerCase().includes(txt)
    );
  });

  // PAGINAÇÃO
  const indexUltimo = paginaAtual * itensPorPagina;
  const indexPrimeiro = indexUltimo - itensPorPagina;
  const listaAtual = listaFiltrada.slice(indexPrimeiro, indexUltimo);
  const totalPaginas = Math.ceil(listaFiltrada.length / itensPorPagina);

  // MODAL EXCLUSÃO
  const abrirModalExclusao = (id) => {
    setIdParaExcluir(id);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setIdParaExcluir(null);
  };

  const confirmarExclusao = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/manutencao/excluir/${idParaExcluir}`,
        { method: "DELETE" }
      );

      if (response.status === 200) {
        toast.success("Manutenção excluída com sucesso!");
        fetchManutencoes();
      } else {
        toast.error("Erro ao excluir manutenção.");
      }
    } catch {
      toast.error("Erro ao excluir manutenção.");
    }

    fecharModal();
  };

  const formatarData = (d) => {
    if (!d) return "-";
    const data = new Date(d);
    return data.toLocaleDateString("pt-BR");
  };

  // ===============================
  // FUNÇÃO PARA EXPORTAR CSV
  // ===============================
  const exportarCSV = () => {
    if (!manutencoes || manutencoes.length === 0) {
      return toast.warn("Nenhuma manutenção para exportar.");
    }

    const cabecalho = [
      "ID",
      "Equipamento",
      "Cliente",
      "Data Solicitação",
      "Data Execução",
      "Tipo",
      "Status",
      "Técnico",
    ];

    const linhas = manutencoes.map((m) => [
      m.id,
      m.maquina || "",
      m.cliente || "",
      formatarData(m.data_solicitacao),
      formatarData(m.data_execucao),
      m.tipo_manutencao || "",
      m.status || "",
      m.nome || "",
    ]);

    const csvArray = [cabecalho, ...linhas]
      .map((linha) => linha.map((col) => `"${col}"`).join(","))
      .join("\n");

    const blob = new Blob([csvArray], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "manutencoes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="layout">
      <Navbar />

      <main className="content">
        <h2>Lista de Manutenções</h2>

        <div className="botoes-superiores">
          <button
            className="btn-criar-novo"
            onClick={() => navigate("/manutencao/nova")}
          >
            + Nova Manutenção
          </button>

          <button className="btn-exportar" onClick={exportarCSV}>
            📄 Exportar CSV
          </button>
        </div>

        <input
          type="text"
          className="input-busca"
          placeholder="Buscar por ID, equipamento, tipo ou status..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        {listaFiltrada.length === 0 ? (
          <p>Nenhuma manutenção encontrada.</p>
        ) : (
          <>
            <table className="venda-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Equipamento</th>
                  <th>Cliente</th>
                  <th>Execução</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Técnico</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {listaAtual.map((m) => (
                  <tr key={m.id}>
                    <td>{m.id}</td>
                    <td>{m.maquina}</td>
                    <td>{formatarData(m.data_solicitacao)}</td>
                    <td>{formatarData(m.data_execucao)}</td>
                    <td>{m.tipo_manutencao}</td>

                    <td>
                      <span className={m.status}>{m.Status}</span>
                    </td>

                    <td>{m.nome}</td>

                    <td>
                      <MenuAcoes
                        onEditar={() => navigate(`/manutencao/editar/${m.id}`)}
                        onExcluir={() => abrirModalExclusao(m.id)}
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

        {/* MODAL CONFIRMAÇÃO */}
        {modalAberto && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">Confirmar Exclusão</div>

              <p>Tem certeza que deseja excluir esta manutenção?</p>

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
      </main>
    </div>
  );
};

export default ListarManutencoes;
