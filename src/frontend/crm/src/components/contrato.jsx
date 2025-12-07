import React, { useState, useEffect } from "react";
import { Navbar } from "./navbar.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./css/novaVenda.css";

export function RegistroContrato() {
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [contrato, setContrato] = useState({
    cliente_id: 0,
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
    const loadData = async () => {
      try {
        const [resClientes, resUsuarios] = await Promise.all([
          fetch("http://localhost:3000/api/cliente/listar"),
          fetch("http://localhost:3000/api/usuario/listar"),
        ]);

        const clientesData = await resClientes.json();
        const usuariosData = await resUsuarios.json();

        setClientes(clientesData.msg || []);
        setUsuarios(usuariosData.msg || []);
      } catch (err) {
        toast.error("Erro ao carregar dados");
      }
    };
    loadData();
  }, []);

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

    // Correção: passar o objeto contrato para Object.keys()
    Object.keys(contrato).forEach((key) => {
      formData.append(key, contrato[key]);
    });

    try {
      const response = await fetch("http://localhost:3000/api/contrato/criar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contrato),
      });

      console.log(JSON.stringify(contrato));

      if (response.status === 201) {
        toast.success("Contrato salvo com sucesso!");
        navigate("/contrato");
      } else {
        toast.error("Erro ao salvar contrato");
      }
    } catch (err) {
      toast.error("Erro ao enviar contrato");
    }
  };

  return (
    <section className="contrato-page">
      <Navbar />

      <div className="contrato-container">
        <h1 className="titulo">
          <span>📄</span> Cadastro de Contrato
        </h1>

        <form onSubmit={handleSubmit} className="formulario">
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

          <div className="footer-resumo">
            <div className="acoes">
              <button type="submit" className="btn-salvar">
                💾 Salvar
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

export default RegistroContrato;
