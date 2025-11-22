import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./css/alocacoes.css";
import { Navbar } from "./navbar";

function AlocacaoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const editando = Boolean(id);

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

  useEffect(() => {
    if (editando && location.state) {
      setForm(location.state);
    }
  }, []);

  const salvar = async () => {
    const url = editando
      ? `http://localhost:3000/api/alocacao/editar/${id}`
      : "http://localhost:3000/api/alocacao/criar";

    const metodo = editando ? "PUT" : "POST";

    const resp = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (resp.ok) {
      navigate("/alocacao");
    } else {
      alert("Erro ao salvar alocação");
    }
  };

  return (
    <div className="aloc-container">
      <Navbar />
      <h1>{editando ? "Editar Alocação" : "Nova Alocação"}</h1>

      <div className="page-form">
        <div className="form-grid">
          <label>Máquina ID</label>
          <input
            type="number"
            value={form.maquina_id}
            onChange={(e) => setForm({ ...form, maquina_id: e.target.value })}
          />

          <label>Cliente ID</label>
          <input
            type="number"
            value={form.cliente_id}
            onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
          />

          <label>Data Início</label>
          <input
            type="date"
            value={form.data_inicio?.slice(0, 10)}
            onChange={(e) => setForm({ ...form, data_inicio: e.target.value })}
          />

          <label>Data Fim</label>
          <input
            type="date"
            value={form.data_fim?.slice(0, 10)}
            onChange={(e) => setForm({ ...form, data_fim: e.target.value })}
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
            onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
          ></textarea>
        </div>

        <div className="form-buttons">
          <button className="btn-save" onClick={salvar}>
            Salvar
          </button>
          <button className="btn-cancel" onClick={() => navigate("/alocacao")}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlocacaoForm;
