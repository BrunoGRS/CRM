import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./css/alocacoes.css";
import { Navbar } from "./navbar.jsx";

function Alocacao() {
  const [alocacoes, setAlocacoes] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(false);
  const navigate = useNavigate();

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

  const carregarAlocacoes = async () => {
    const resp = await fetch("http://localhost:3000/api/alocacao/listar");
    const dados = await resp.json();
    setAlocacoes(dados);
  };

  useEffect(() => {
    carregarAlocacoes();
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

  const editarAlocacao = (item) => {
    setEditando(true);
    setForm(item);
    setModalAberto(true);
  };

  const salvar = async () => {
    const url = editando
      ? `http://localhost:3000/api/alocacao/editar/${form.id}`
      : "http://localhost:3000/api/alocacao/criar";

    const metodo = editando ? "PUT" : "POST";

    const resp = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (resp.ok) {
      setModalAberto(false);
      carregarAlocacoes();
    } else {
      alert("Erro ao salvar alocação");
    }
  };

  const excluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir?")) return;

    const resp = await fetch(
      `http://localhost:3000/api/alocacao/deletar/${id}`,
      { method: "DELETE" }
    );

    if (resp.ok) carregarAlocacoes();
    else alert("Erro ao excluir");
  };

  return (
    <div className="aloc-container">
      <Navbar />
      <h1>Alocações de Máquina</h1>

      <button className="btn-add" onClick={() => navigate("/alocacao/nova")}>
        + Nova Alocação
      </button>

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
          {alocacoes.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.maquina_id}</td>
              <td>{a.cliente_id}</td>
              <td>{a.data_inicio?.slice(0, 10)}</td>
              <td>{a.data_fim?.slice(0, 10)}</td>
              <td>{a.status}</td>
              <td>
                <button className="btn-edit" onClick={() => editarAlocacao(a)}>
                  Editar
                </button>

                <button className="btn-del" onClick={() => excluir(a.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}

          {alocacoes.length === 0 && (
            <tr>
              <td colSpan="7">Nenhuma alocação encontrada</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL */}
      {modalAberto && (
        <div className="modal-bg">
          <div className="modal">
            <h2>{editando ? "Editar Alocação" : "Nova Alocação"}</h2>

            {/* ------------------------- */}
            {/* ÁREA COM SCROLL */}
            {/* ------------------------- */}
            <div className="modal-body-scroll">
              <div className="form-grid">
                <label>Máquina ID</label>
                <input
                  type="number"
                  value={form.maquina_id}
                  onChange={(e) =>
                    setForm({ ...form, maquina_id: e.target.value })
                  }
                />

                <label>Cliente ID</label>
                <input
                  type="number"
                  value={form.cliente_id}
                  onChange={(e) =>
                    setForm({ ...form, cliente_id: e.target.value })
                  }
                />

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
                <input
                  type="text"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                />

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
                    setForm({
                      ...form,
                      responsavel_instalacao: e.target.value,
                    })
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

            {/* BOTÕES FIXOS */}
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
