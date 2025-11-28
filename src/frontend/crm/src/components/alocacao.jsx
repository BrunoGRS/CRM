import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./navbar.jsx";
import MenuAcoes from "./menuAcoes.jsx";
import "./css/alocacoes.css";

const ListaAlocacoes = () => {
  const navigate = useNavigate();
  const [alocacoes, setAlocacoes] = useState([]);
  const [busca, setBusca] = useState("");

  // paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const carregarAlocacoes = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/alocacao/listar");
      const data = await response.json();
      setAlocacoes(data);
    } catch (error) {
      console.error("Erro ao carregar alocações:", error);
    }
  };

  useEffect(() => {
    carregarAlocacoes();
  }, []);

  const filtrar = (item) => {
    const texto = busca.toLowerCase();
    return (
      item.id.toString().includes(texto) ||
      item.cliente?.nome?.toLowerCase().includes(texto) ||
      item.maquina?.nome?.toLowerCase().includes(texto) ||
      item.status?.toLowerCase().includes(texto)
    );
  };

  // PAGINAÇÃO
  const dadosFiltrados = alocacoes.filter(filtrar);
  const totalPaginas = Math.ceil(dadosFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const exibidos = dadosFiltrados.slice(inicio, fim);

  // PDF
  const gerarPDF = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/alocacao/pdf/${id}`
      );

      const blob = await response.blob(); // ← fetch usa blob()
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `alocacao_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    }
  };

  const deletar = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta alocação?")) return;

    try {
      await fetch(`http://localhost:3000/api/alocacao/delete/${id}`, {
        method: "DELETE",
      });

      carregarAlocacoes();
    } catch (error) {
      console.error("Erro ao excluir alocação:", error);
    }
  };

  return (
    <div className="lista-container">
      <Navbar />
      <main className="content">
        <h1 className="titulo">Lista de Alocações</h1>

        <div className="top-actions">
          <button
            className="btn-novo"
            onClick={() => navigate("/alocacao/nova")}
          >
            + Nova Alocação
          </button>

          <input
            type="text"
            className="campo-busca"
            placeholder="Buscar por código, cliente, máquina..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

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
            {exibidos.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.maquina?.nome || "-"}</td>
                <td>{item.cliente?.nome || "-"}</td>
                <td>{item.data_inicio}</td>
                <td>{item.data_fim || "-"}</td>
                <td>{item.status}</td>

                <MenuAcoes
                  onEditar={() => navigate(`/alocacao/editar/${item.id}`)}
                  onExcluir={() => deletar(item.id)}
                  onPDF={() => {
                    const alocacaoParaPDF = alocacoes.find(
                      (a) => a.id === item.id
                    );
                    if (alocacaoParaPDF) {
                      gerarPDFBrastalia(alocacaoParaPDF);
                    } else {
                      toast.warning("Dados completos carregando...");
                    }
                  }}
                />
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINAÇÃO */}
        <div className="paginacao">
          <button
            disabled={paginaAtual === 1}
            onClick={() => setPaginaAtual((p) => p - 1)}
          >
            ← Anterior
          </button>

          <span>
            Página {paginaAtual} de {totalPaginas || 1}
          </span>

          <button
            disabled={paginaAtual === totalPaginas}
            onClick={() => setPaginaAtual((p) => p + 1)}
          >
            Próxima →
          </button>
        </div>
      </main>
    </div>
  );
};

export default ListaAlocacoes;
