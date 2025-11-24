import { useEffect, useState } from "react";
import { Navbar } from "./navbar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./css/alocacoes.css";

export default function AlocacaoCriar() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);

  const [form, setForm] = useState({
    maquina_id: "",
    cliente_id: "",
    data_inicio: "",
    data_fim: "",
    status: "",
    local_instalacao: "",
    responsavel_instalacao: "",
    observacoes: "",
  });

  // =============================
  // BUSCAR CLIENTES
  // =============================
  const fetchClientes = async () => {
    try {
      const resp = await fetch("http://localhost:3000/api/cliente/listar");
      const data = await resp.json();
      setClientes(Array.isArray(data.msg) ? data.msg : []);
    } catch (error) {
      toast.error("Erro ao carregar clientes");
    }
  };

  // =============================
  // BUSCAR PRODUTOS (MÁQUINAS)
  // =============================
  const fetchProdutos = async () => {
    try {
      const resp = await fetch("http://localhost:3000/api/produto/listar");
      const data = await resp.json();
      setProdutos(Array.isArray(data.msg) ? data.msg : []);
    } catch (error) {
      toast.error("Erro ao carregar máquinas/produtos");
    }
  };

  useEffect(() => {
    fetchClientes();
    fetchProdutos();
  }, []);

  // =============================
  // SALVAR ALOCAÇÃO
  // =============================
  const salvar = async () => {
    try {
      const resp = await fetch("http://localhost:3000/api/alocacao/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!resp.ok) {
        toast.error("Erro ao salvar alocação");
        return;
      }

      toast.success("Alocação criada!");
      navigate("/alocacao");
    } catch (error) {
      toast.error("Erro ao salvar");
    }
  };

  return (
    <section className="aloc-container">
      <Navbar />
      <h1>Nova Alocação</h1>

      <div className="aloc-form">
        {/* SELECIONAR MÁQUINA */}
        <label>Máquina / Produto</label>
        <select
          value={form.maquina_id}
          onChange={(e) => setForm({ ...form, maquina_id: e.target.value })}
        >
          <option value="">Selecione</option>
          {produtos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>

        {/* SELECIONAR CLIENTE */}
        <label>Cliente</label>
        <select
          value={form.cliente_id}
          onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
        >
          <option value="">Selecione</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.fantasiaEmpresa || c.razaoSocialEmpresa}
            </option>
          ))}
        </select>

        <label>Data Início</label>
        <input
          type="date"
          value={form.data_inicio}
          onChange={(e) => setForm({ ...form, data_inicio: e.target.value })}
        />

        <label>Data Fim</label>
        <input
          type="date"
          value={form.data_fim}
          onChange={(e) => setForm({ ...form, data_fim: e.target.value })}
        />

        <label>Status</label>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="">Selecione</option>
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

        <label>Responsável Instalação</label>
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
          onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
        ></textarea>

        <div className="aloc-btns">
          <button className="btn-save" onClick={salvar}>
            Salvar
          </button>
          <button className="btn-cancel" onClick={() => navigate("/alocacao")}>
            Cancelar
          </button>
        </div>
      </div>
    </section>
  );
}
