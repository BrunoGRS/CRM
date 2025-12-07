// EditarContrato.jsx
import React, { useState, useEffect } from "react";
import { Navbar } from "./navbar.jsx";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "./css/novaVenda.css";

export function EditarContrato() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [loading, setLoading] = useState(true);

  const [contrato, setContrato] = useState({
    cliente_id: "",
    usuario_responsavel_id: "",
    numero_contrato: "",
    titulo: "",
    tipo_contrato: "",
    descricao: "",
    data_assinatura: "",
    data_inicio: "",
    data_fim: "",
    valor_total: "",
    valor_mensal: "",
    forma_pagamento: "",
    status: "ATIVO",
    arquivo: null,
  });

  useEffect(() => {
    const carregar = async () => {
      try {
        const [cliRes, usuRes, contratoRes] = await Promise.all([
          fetch("http://localhost:3000/api/cliente/listar"),
          fetch("http://localhost:3000/api/usuario/listar"),
          fetch(`http://localhost:3000/api/contrato/${id}`),
        ]);

        const clientesData = await cliRes.json();
        const usuariosData = await usuRes.json();
        const contratoData = await contratoRes.json();

        setClientes(clientesData.msg || []);
        setUsuarios(usuariosData.msg || []);

        const c = contratoData.msg;

        setContrato({
          cliente_id: c.cliente_id ?? "",
          usuario_responsavel_id: c.usuario_responsavel_id ?? "",
          numero_contrato: c.numero_contrato ?? "",
          titulo: c.titulo ?? "",
          tipo_contrato: c.tipo_contrato ?? "",
          descricao: c.descricao ?? "",
          data_assinatura: c.data_assinatura?.substring(0, 10) ?? "",
          data_inicio: c.data_inicio?.substring(0, 10) ?? "",
          data_fim: c.data_fim?.substring(0, 10) ?? "",
          valor_total: c.valor_total ?? "",
          valor_mensal: c.valor_mensal ?? "",
          forma_pagamento: c.forma_pagamento ?? "",
          status: c.status ?? "ATIVO",
          arquivo: null,
        });
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar dados.");
      }

      setLoading(false);
    };

    carregar();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setContrato({ ...contrato, arquivo: files[0] });
    } else {
      setContrato({ ...contrato, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(contrato).forEach((key) => {
      formData.append(key, contrato[key]);
    });

    try {
      const resp = await fetch(
        `http://localhost:3000/api/contrato/editar/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contrato),
        }
      );

      if (!resp.ok) {
        toast.error("Erro ao salvar alterações");
        return;
      }

      toast.success("Contrato atualizado!");
      navigate("/contrato");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao enviar dados");
    }
  };

  if (loading) return <p style={{ padding: 30 }}>Carregando...</p>;

  return (
    <section className="contrato-page">
      <Navbar />

      <div className="contrato-container">
        <h1 className="titulo">
          <span>✏️</span> Editar Contrato
        </h1>

        <form onSubmit={handleSubmit} className="formulario">
          {/* CARD 1 - CLIENTE */}
          <div className="card">
            <h2 className="card-title">Informações do Cliente</h2>

            <div className="form-row">
              <label>Cliente</label>
              <select
                name="cliente_id"
                value={contrato.cliente_id}
                onChange={handleChange}
                required
              >
                <option value="">Selecione...</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.razaoSocialEmpresa}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Responsável Interno</label>
              <select
                name="usuario_responsavel_id"
                value={contrato.usuario_responsavel_id}
                onChange={handleChange}
                required
              >
                <option value="">Selecione...</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CARD 2 - DADOS DO CONTRATO */}
          <div className="card">
            <h2 className="card-title">Dados do Contrato</h2>

            <div className="form-grid">
              <div>
                <label>Número do Contrato</label>
                <input
                  type="text"
                  name="numero_contrato"
                  value={contrato.numero_contrato}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={contrato.titulo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Tipo</label>
                <input
                  type="text"
                  name="tipo_contrato"
                  value={contrato.tipo_contrato}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Forma de Pagamento</label>
                <input
                  type="text"
                  name="forma_pagamento"
                  value={contrato.forma_pagamento}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Status</label>
                <select
                  name="status"
                  value={contrato.status}
                  onChange={handleChange}
                >
                  <option value="ATIVO">ATIVO</option>
                  <option value="INATIVO">INATIVO</option>
                  <option value="CANCELADO">CANCELADO</option>
                </select>
              </div>
            </div>

            <div className="form-row full">
              <label>Descrição</label>
              <textarea
                name="descricao"
                value={contrato.descricao}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* CARD 3 - DATAS */}
          <div className="card">
            <h2 className="card-title">Datas</h2>

            <div className="form-grid">
              <div>
                <label>Assinatura</label>
                <input
                  type="date"
                  name="data_assinatura"
                  value={contrato.data_assinatura}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Início</label>
                <input
                  type="date"
                  name="data_inicio"
                  value={contrato.data_inicio}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Fim</label>
                <input
                  type="date"
                  name="data_fim"
                  value={contrato.data_fim}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* CARD 4 - FINANCEIRO */}
          <div className="card">
            <h2 className="card-title">Financeiro</h2>

            <div className="form-grid">
              <div>
                <label>Valor Total (R$)</label>
                <input
                  type="number"
                  name="valor_total"
                  step="0.01"
                  value={contrato.valor_total}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Valor Mensal (R$)</label>
                <input
                  type="number"
                  name="valor_mensal"
                  step="0.01"
                  value={contrato.valor_mensal}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Arquivo Anexado</h2>
            <input type="file" name="arquivo" onChange={handleChange} />
          </div>

          <div className="footer-resumo">
            <div className="acoes">
              <button type="submit" className="btn-salvar">
                💾 Salvar Alterações
              </button>

              <button
                type="button"
                className="btn-voltar"
                onClick={() => navigate("/contrato")}
              >
                ⬅ Voltar
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default EditarContrato;
