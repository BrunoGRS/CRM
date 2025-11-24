import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/alocacoes.css";
import { Navbar } from "./navbar.jsx";

function Alocacao() {
  const [alocacoes, setAlocacoes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(false);
  const navigate = useNavigate();

  const [busca, setBusca] = useState("");

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

  // ============================
  // 🔄 CARREGAR DADOS DO BACKEND
  // ============================
  const carregarAlocacoes = async () => {
    const resp = await fetch("http://localhost:3000/api/alocacao/listar");
    const dados = await resp.json();
    setAlocacoes(dados);
  };

  const carregarClientesEMaquinas = async () => {
    const [rc, rm] = await Promise.all([
      fetch("http://localhost:3000/api/cliente/listar"),
      fetch("http://localhost:3000/api/produto/listar"),
    ]);

    const c = await rc.json();
    const m = await rm.json();

    setClientes(c.msg || []);
    setMaquinas(m.msg || []);
  };

  useEffect(() => {
    carregarAlocacoes();
    carregarClientesEMaquinas();
  }, []);

  // ============================
  // 🆕 NOVA ALOCAÇÃO
  // ============================
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

  // ============================
  // ✏ EDITAR ALOCAÇÃO
  // ============================
  const editarAlocacao = (item) => {
    setEditando(true);
    setForm(item);
    setModalAberto(true);
  };

  // ============================
  // 💾 SALVAR
  // ============================
  const salvar = async () => {
    const url = editando
      ? `http://localhost:3000/api/alocacao/editar/${form.id}`
      : "http://localhost:3000/api/alocacao/criar";

    const metodo = editando ? "PUT" : "POST";

    const body = {
      ...form,
      data_inicio: form.data_inicio,
      data_fim: form.data_fim || null,
    };

    const resp = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (resp.ok) {
      setModalAberto(false);
      carregarAlocacoes();
    } else {
      alert("Erro ao salvar alocação");
    }
  };

  // ============================
  // 🗑 EXCLUIR
  // ============================
  const excluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir?")) return;

    const resp = await fetch(
      `http://localhost:3000/api/alocacao/deletar/${id}`,
      { method: "DELETE" }
    );

    if (resp.ok) carregarAlocacoes();
    else alert("Erro ao excluir");
  };

  // ============================
  // 🔎 FILTRO + NOMES DO CLIENTE / MÁQUINA
  // ============================
  const alocacoesFiltradas = alocacoes.filter((a) => {
    const txt = busca.toLowerCase();

    return (
      String(a.id).includes(txt) ||
      a.cliente_nome?.toLowerCase().includes(txt) ||
      a.maquina_nome?.toLowerCase().includes(txt) ||
      a.status?.toLowerCase().includes(txt) ||
      a.local_instalacao?.toLowerCase().includes(txt)
    );
  });

  return (
    <div className="aloc-container">
      <Navbar />
      <h1>Alocações de Máquina</h1>

      <button className="btn-add" onClick={novaAlocacao}>
        + Nova Alocação
      </button>

      <input
        type="text"
        className="input-busca"
        placeholder="Buscar por Nome do Cliente, Máquina, Status..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

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

          {alocacoesFiltradas.length === 0 && (
            <tr>
              <td colSpan="7">Nenhuma alocação encontrada</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ============================
          MODAL
        ============================ */}
      {modalAberto && (
        <div className="modal-bg">
          <div className="modal">
            <h2>{editando ? "Editar Alocação" : "Nova Alocação"}</h2>

            <div className="modal-body-scroll">
              <div className="form-grid">
                {/* SELECT MÁQUINA */}
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

                {/* SELECT CLIENTE */}
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

                {/* DEMAIS CAMPOS */}
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
