import React, { useEffect, useState } from "react";
import "./css/novaManutencao.css"; // usa o mesmo CSS
import { Navbar } from "./navbar";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export function EditarManutencao({ onClose, atualizarLista }) {
  const { id } = useParams(); // pega ID da URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    equipamento_id: "",
    tipo_manutencao: "",
    data_solicitacao: "",
    data_execucao: "",
    responsavel_id: "",
    descricao: "",
    custo_total: "",
    status: "",
    observacoes: "",
  });

  const [produtos, setProdutos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // 🔥 Carregar produtos
  async function fetchProdutos() {
    try {
      const resp = await fetch("http://localhost:3000/api/produto/listar");
      const data = await resp.json();
      if (Array.isArray(data.msg)) setProdutos(data.msg);
    } catch (err) {
      console.log("Erro ao carregar produtos", err);
    }
  }

  // 🔥 Carregar usuários
  async function fetchUsuarios() {
    try {
      const resp = await fetch("http://localhost:3000/api/usuario/listar");
      const data = await resp.json();
      if (Array.isArray(data.msg)) setUsuarios(data.msg);
    } catch (err) {
      console.log("Erro ao carregar usuários", err);
    }
  }

  // 🔥 Carregar dados da manutenção
  async function fetchManutencao() {
    try {
      const resp = await fetch(
        `http://localhost:3000/api/manutencao/listar/${id}`
      );
      const data = await resp.json();

      if (resp.ok && data.msg) {
        setForm({
          equipamento_id: data.msg.equipamento_id ?? "",
          tipo_manutencao: data.msg.tipo_manutencao ?? "",
          data_solicitacao: data.msg.data_solicitacao?.substring(0, 10) ?? "",
          data_execucao: data.msg.data_execucao?.substring(0, 10) ?? "",
          responsavel_id: data.msg.responsavel_id ?? "",
          descricao: data.msg.descricao ?? "",
          custo_total: data.msg.custo_total ?? "",
          status: data.msg.status ?? "",
          observacoes: data.msg.observacoes ?? "",
        });
      }
    } catch (err) {
      console.log("Erro ao carregar manutenção", err);
    }
  }

  useEffect(() => {
    fetchProdutos();
    fetchUsuarios();
    fetchManutencao();
  }, []);

  function atualizarCampo(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // 🔥 salvar edição
  async function salvar() {
    setLoading(true);
    setMsg(null);

    try {
      const resp = await fetch(
        `http://localhost:3000/api/manutencao/editar/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const result = await resp.json();

      if (resp.ok) {
        toast.success("Manutenção atualizada com sucesso!");
        if (atualizarLista) atualizarLista();
        navigate("/manutencao");
      } else {
        setMsg({ tipo: "erro", texto: result.msg || "Erro ao atualizar." });
      }
    } catch (err) {
      setMsg({ tipo: "erro", texto: "Erro de comunicação com o servidor." });
    }

    setLoading(false);
  }

  return (
    <div className="modal-manutencao-container">
      <div className="modal-manutencao">
        <h2>Editar Manutenção #{id}</h2>

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
                  {p.nome}
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
              <option value="preventiva">Preventiva</option>
              <option value="corretiva">Corretiva</option>
              <option value="inspecao">Inspeção</option>
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
            <label>Responsável</label>
            <select
              name="responsavel_id"
              value={form.responsavel_id}
              onChange={atualizarCampo}
            >
              <option value="">Selecione</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="campo">
            <label>Status</label>
            <select name="status" value={form.status} onChange={atualizarCampo}>
              <option value="">Selecione</option>
              <option value="aberta">Aberta</option>
              <option value="em_execucao">Em Execução</option>
              <option value="concluida">Concluída</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>

        <div className="linha">
          <div className="campo">
            <label>Custo Total (R$)</label>
            <input
              type="number"
              step="0.01"
              name="custo_total"
              value={form.custo_total}
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
          <button
            className="btn-cancelar"
            onClick={() => navigate("/manutencao")}
          >
            Cancelar
          </button>

          <button className="btn-salvar" onClick={salvar} disabled={loading}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditarManutencao;
