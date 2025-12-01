import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/editarAlocacao.css";
import { Navbar } from "./navbar";

export function EditarAlocacao() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    maquina_id: "",
    cliente_id: "",
    data_inicio: "",
    data_fim: "",
    status: "",
    cep: "",
    rua: "",
    bairro: "",
    cidade: "",
    uf: "",
    numero: "",
    complemento: "",
    local_instalacao: "",
    responsavel_instalacao: "",
    observacoes: "",
  });

  // ===========================
  // BUSCAR ALOCAÇÃO POR ID
  // ===========================
  useEffect(() => {
    async function carregar() {
      try {
        const r = await fetch(
          `http://localhost:3000/api/alocacao/buscar/${id}`
        );
        const dados = await r.json();

        // Preenche o formulário com informações vindas da API
        setForm((prev) => ({
          ...prev,
          maquina_id: dados.maquina_id || "",
          cliente_id: dados.cliente_id || "",
          data_inicio: dados.data_inicio || "",
          data_fim: dados.data_fim || "",
          status: dados.status || "",
          local_instalacao: dados.local_instalacao || "",
          responsavel_instalacao: dados.responsavel_instalacao || "",
          observacoes: dados.observacoes || "",
        }));
      } catch (error) {
        console.error("Erro ao buscar alocação:", error);
      }
    }

    carregar();
  }, [id]);

  // ===========================
  // BUSCAR CEP
  // ===========================
  const buscarCEP = async (valor) => {
    const somenteNumeros = valor.replace(/\D/g, "");

    if (somenteNumeros.length === 8) {
      const response = await fetch(
        `https://viacep.com.br/ws/${somenteNumeros}/json/`
      );
      const data = await response.json();

      if (!data.erro) {
        setLogradouro(data.logradouro);
        setBairro(data.bairro);
        setCidade(data.localidade);
        setUf(data.uf);
      }
    }
  };

  // ===========================
  // SALVAR ALOCAÇÃO (PUT)
  // ===========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // monta o local_instalacao final
    const enderecoCompleto = `${form.rua}, ${form.numero || "s/n"} - ${
      form.bairro
    }, ${form.cidade}/${form.uf} - CEP ${form.cep}${
      form.complemento ? " (" + form.complemento + ")" : ""
    }`;

    try {
      const r = await fetch(`http://localhost:3000/api/alocacao/editar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maquina_id: form.maquina_id,
          cliente_id: form.cliente_id,
          data_inicio: form.data_inicio,
          data_fim: form.data_fim,
          status: form.status,
          local_instalacao: enderecoCompleto,
          responsavel_instalacao: form.responsavel_instalacao,
          observacoes: form.observacoes,
        }),
      });

      if (!r.ok) {
        alert("Erro ao atualizar alocação!");
        return;
      }

      alert("Alocação atualizada com sucesso!");
      navigate("/alocacoes");
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  // Atualiza os campos
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="alocacao-container">
      <Navbar />
      <h2>Editar Alocação #{id}</h2>

      <form className="alocacao-form" onSubmit={handleSubmit}>
        {/* CAMPOS PRINCIPAIS */}

        <div className="form-group">
          <label>Máquina</label>
          <input
            type="text"
            name="maquina_id"
            value={form.maquina_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Cliente</label>
          <input
            type="text"
            name="cliente_id"
            value={form.cliente_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className="double-row">
          <div className="form-group">
            <label>Data Início</label>
            <input
              type="date"
              name="data_inicio"
              value={form.data_inicio}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Data Fim</label>
            <input
              type="date"
              name="data_fim"
              value={form.data_fim}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* STATUS */}
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="">Selecione</option>
            <option value="ATIVA">ATIVA</option>
            <option value="FINALIZADA">FINALIZADA</option>
            <option value="MANUTENCAO">MANUTENÇÃO</option>
          </select>
        </div>

        {/* CEP + ENDEREÇO */}
        <h3>Local de Instalação</h3>

        <div className="cep-row">
          <div>
            <label>CEP</label>
            <input
              type="text"
              name="cep"
              maxLength={8}
              value={form.cep}
              onChange={handleChange}
            />
          </div>

          <button type="button" className="btn-cep" onClick={buscarCEP}>
            Buscar CEP
          </button>
        </div>

        <div className="double-row">
          <div className="form-group">
            <label>Rua</label>
            <input
              type="text"
              name="rua"
              value={form.rua}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Número</label>
            <input
              type="text"
              name="numero"
              value={form.numero}
              onChange={handleChange}
              placeholder="s/n"
            />
          </div>
        </div>

        <div className="double-row">
          <div className="form-group">
            <label>Bairro</label>
            <input
              type="text"
              name="bairro"
              value={form.bairro}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Cidade</label>
            <input
              type="text"
              name="cidade"
              value={form.cidade}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group small">
          <label>UF</label>
          <input
            type="text"
            name="uf"
            maxLength={2}
            value={form.uf}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Complemento</label>
          <input
            type="text"
            name="complemento"
            value={form.complemento}
            onChange={handleChange}
          />
        </div>

        {/* RESPONSÁVEL */}
        <div className="form-group">
          <label>Responsável pela Instalação</label>
          <input
            type="text"
            name="responsavel_instalacao"
            value={form.responsavel_instalacao}
            onChange={handleChange}
          />
        </div>

        {/* OBS */}
        <div className="form-group">
          <label>Observações</label>
          <textarea
            name="observacoes"
            value={form.observacoes}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <button className="btn-salvar" type="submit">
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}

export default EditarAlocacao;
