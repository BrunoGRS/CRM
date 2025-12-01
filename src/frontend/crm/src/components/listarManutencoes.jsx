import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./css/listarManutencoes.css";
import { Navbar } from "./navbar";

export const ListarManutencoes = () => {
  const [manutencoes, setManutencoes] = useState([]);
  const [busca, setBusca] = useState("");

  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(10);

  const [idParaExcluir, setIdParaExcluir] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  // Buscar lista
  const fetchManutencoes = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/manutencao/listar"
      );

      const data = await response.json();
      const lista = Array.isArray(data.msg) ? data.msg : [];

      setManutencoes(lista);
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
      String(m.alocacao_id).includes(txt) ||
      (m.tipo || "").toLowerCase().includes(txt) ||
      (m.status || "").toLowerCase().includes(txt)
    );
  });

  // PAGINAÇÃO
  const indexUltimo = paginaAtual * itensPorPagina;
  const indexPrimeiro = indexUltimo - itensPorPagina;
  const listaAtual = listaFiltrada.slice(indexPrimeiro, indexUltimo);
  const totalPaginas = Math.ceil(listaFiltrada.length / itensPorPagina);

  const mudarPagina = (num) => setPaginaAtual(num);

  // Excluir
  const abrirModalExcluir = (id) => {
    setIdParaExcluir(id);
    setShowModal(true);
  };

  const excluirManutencao = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/manutencao/excluir/${idParaExcluir}`,
        { method: "DELETE" }
      );

      if (response.status === 200) {
        toast.success("Manutenção excluída com sucesso!");
        setShowModal(false);
        fetchManutencoes();
      } else {
        toast.error("Erro ao excluir manutenção.");
      }
    } catch (error) {
      toast.error("Erro ao excluir manutenção.");
    }
  };

  const formatarData = (d) => {
    if (!d) return "-";
    const data = new Date(d);
    return data.toLocaleDateString("pt-BR");
  };

  return (
    <div className="layout">
      <Navbar />

      <main className="content">
        <h2>Lista de Manutenções</h2>

        <button
          className="btn-criar-novo"
          onClick={() => navigate("/manutencao/nova")}
        >
          + Nova Manutenção
        </button>

        <input
          type="text"
          className="input-busca"
          placeholder="Buscar por ID, alocação, tipo ou status..."
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
                  <th>Alocação</th>
                  <th>Data</th>
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
                    <td>{m.alocacao_id}</td>
                    <td>{formatarData(m.data_manutencao)}</td>
                    <td>{m.tipo}</td>

                    <td>
                      <span
                        className={`status-badge status-${m.status
                          .replace(" ", "-")
                          .toLowerCase()}`}
                      >
                        {m.status}
                      </span>
                    </td>

                    <td>{m.tecnico_responsavel}</td>

                    <td>
                      <button
                        className="btn-editar"
                        onClick={() => navigate(`/manutencao/editar/${m.id}`)}
                      >
                        Editar
                      </button>

                      <button
                        className="btn-excluir"
                        onClick={() => abrirModalExcluir(m.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINAÇÃO */}
            <div className="paginacao-container">
              <button
                onClick={() => mudarPagina(paginaAtual - 1)}
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
                  onClick={() => mudarPagina(i + 1)}
                >
                  {i + 1}
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

        {/* MODAL CONFIRMAÇÃO */}

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Confirmar Exclusão</h3>
              <p>Tem certeza que deseja excluir esta manutenção?</p>

              <div className="modal-actions">
                <button className="btn-confirmar" onClick={excluirManutencao}>
                  Confirmar
                </button>

                <button
                  className="btn-cancelar"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
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
