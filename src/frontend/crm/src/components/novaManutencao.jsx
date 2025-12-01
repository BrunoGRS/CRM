import React, { useEffect, useState } from "react";
import "./css/novaManutencao.css";
import { Navbar } from "./navbar";

export function NovaManutencao({ onClose, atualizarLista }) {
  const [form, setForm] = useState({
    equipamento_id: "",
    tipo_manutencao: "",
    data_solicitacao: "",
    data_execucao: "",
    tecnico_responsavel: "",
    descricao: "",
    custo: "",
    status: "",
    observacoes: "",
  });

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // 🔥 BUSCAR PRODUTOS
  async function fetchProdutos() {
    try {
      const resp = await fetch("http://localhost:3000/api/produto/listar");
      const data = await resp.json();
      if (Array.isArray(data.msg)) {
        setProdutos(data.msg);
      }
    } catch (err) {
      console.log("Erro ao carregar produtos", err);
    }
  }

  useEffect(() => {
    fetchProdutos();
  }, []);

  function atualizarCampo(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function salvar() {
    setLoading(true);
    setMsg(null);

    try {
      const response = await fetch(
        "http://localhost:3000/api/manutencao/criar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMsg({ tipo: "sucesso", texto: result.msg });
        if (atualizarLista) atualizarLista();
        setTimeout(() => onClose && onClose(), 800);
      } else {
        setMsg({
          tipo: "erro",
          texto: result.msg || "Erro ao registrar manutenção.",
        });
      }
    } catch (error) {
      setMsg({
        tipo: "erro",
        texto: "Erro de comunicação com o servidor.",
      });
    }

    setLoading(false);
  }

  return (
    <div className="modal-manutencao-container">
      <div className="modal-manutencao">
        <h2>Registrar Nova Manutenção</h2>

        {msg && (
          <div className={msg.tipo === "sucesso" ? "msg-sucesso" : "msg-erro"}>
            {msg.texto}
          </div>
        )}

        <div className="linha">
          <div className="campo">
            <label>Equipamento / Máquina</label>
            <select
              name="equipamento_id"
              value={form.equipamento_id}
              onChange={atualizarCampo}
            >
              <option value="">Selecione</option>
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} {p.modelo ? `- ${p.modelo}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label>Tipo de Manutenção</label>
            <select
              name="tipo_manutencao"
              value={form.tipo_manutencao}
              onChange={atualizarCampo}
            >
              <option value="">Selecione</option>
              <option value="Preventiva">Preventiva</option>
              <option value="Corretiva">Corretiva</option>
              <option value="Urgente">Urgente</option>
            </select>
          </div>
        </div>

        <div className="linha">
          <div className="campo">
            <label>Data Solicitação</label>
            <input
              type="date"
              name="data_solicitacao"
              value={form.data_solicitacao}
              onChange={atualizarCampo}
            />
          </div>

          <div className="campo">
            <label>Data Execução</label>
            <input
              type="date"
              name="data_execucao"
              value={form.data_execucao}
              onChange={atualizarCampo}
            />
          </div>
        </div>

        <div className="linha">
          <div className="campo">
            <label>Técnico Responsável</label>
            <input
              type="text"
              name="tecnico_responsavel"
              value={form.tecnico_responsavel}
              onChange={atualizarCampo}
            />
          </div>

          <div className="campo">
            <label>Status</label>
            <select name="status" value={form.status} onChange={atualizarCampo}>
              <option value="">Selecione</option>
              <option value="Pendente">Pendente</option>
              <option value="Em execução">Em execução</option>
              <option value="Concluída">Concluída</option>
            </select>
          </div>
        </div>

        <div className="linha">
          <div className="campo">
            <label>Custo (R$)</label>
            <input
              type="number"
              step="0.01"
              name="custo"
              value={form.custo}
              onChange={atualizarCampo}
            />
          </div>

          <div className="campo">
            <label>Observações</label>
            <input
              type="text"
              name="observacoes"
              value={form.observacoes}
              onChange={atualizarCampo}
            />
          </div>
        </div>

        <div className="campo">
          <label>Descrição</label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={atualizarCampo}
          />
        </div>

        <div className="acoes">
          <button className="btn-cancelar" onClick={onClose}>
            Cancelar
          </button>

          <button className="btn-salvar" onClick={salvar} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NovaManutencao;
