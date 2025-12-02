import React, { useState, useEffect } from "react";
import "./css/novaVenda.css"; // você pode renomear depois
import { Navbar } from "./navbar.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function RegistroContrato() {
  const [clientes, setClientes] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [itens, setItens] = useState([
    { servico_id: "", quantidade: 1, valor_unitario: 0, subtotal: 0 },
  ]);

  const [contrato, setContrato] = useState({
    cliente_id: "",
    observacao: "",
    valor_total: 0,
  });

  const navigate = useNavigate();

  // Atualiza total do contrato
  useEffect(() => {
    const total = itens.reduce(
      (acc, item) => acc + Number(item.subtotal || 0),
      0
    );
    setContrato((prev) => ({ ...prev, valor_total: total.toFixed(2) }));
  }, [itens]);

  const handleContratoChange = (e) => {
    const { name, value } = e.target;
    setContrato({ ...contrato, [name]: value });
  };

  // Busca clientes e serviços
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resClientes, resServicos] = await Promise.all([
          fetch("http://localhost:3000/api/cliente/listar"),
          fetch("http://localhost:3000/api/servico/listar"),
        ]);

        const clientesData = await resClientes.json();
        const servicosData = await resServicos.json();

        setClientes(Array.isArray(clientesData.msg) ? clientesData.msg : []);
        setServicos(Array.isArray(servicosData.msg) ? servicosData.msg : []);
      } catch {
        toast.error("Erro ao carregar dados");
      }
    };
    fetchData();
  }, []);

  // Atualiza itens e recalcula subtotal
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItens = [...itens];
    updatedItens[index][name] = value;

    if (name === "servico_id") {
      const srv = servicos.find((s) => s.id === Number(value));
      if (srv) {
        updatedItens[index].valor_unitario = srv.preco;
      }
    }

    const qtd = parseFloat(updatedItens[index].quantidade || 0);
    const unit = parseFloat(updatedItens[index].valor_unitario || 0);
    updatedItens[index].subtotal = (qtd * unit).toFixed(2);

    setItens(updatedItens);
  };

  // Adicionar item
  const addItem = () => {
    setItens([
      ...itens,
      { servico_id: "", quantidade: 1, valor_unitario: 0, subtotal: 0 },
    ]);
  };

  // Remover item
  const removeItem = (index) => {
    const updatedItens = itens.filter((_, i) => i !== index);
    setItens(updatedItens);
  };

  // Enviar para o backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contrato.cliente_id || itens.length === 0) {
      toast.warn("Selecione o cliente e adicione pelo menos um serviço.");
      return;
    }

    const payload = {
      cliente_id: contrato.cliente_id,
      data_contrato: new Date(),
      valor_total: contrato.valor_total,
      observacao: contrato.observacao,
      itens,
    };

    try {
      const response = await fetch("http://localhost:3000/api/contrato/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 201) {
        toast.success("Contrato registrado com sucesso!");
        navigate("/contrato");
      } else {
        toast.error("Erro ao registrar contrato");
      }
    } catch {
      toast.error("Erro ao salvar contrato");
    }
  };

  return (
    <section className="venda-page">
      <Navbar />
      <div className="venda-wrapper">
        <h2>📄 Registro de Contrato</h2>

        <form onSubmit={handleSubmit}>
          {/* CLIENTE */}
          <div className="form-group">
            <label>Cliente:</label>
            <select
              name="cliente_id"
              value={contrato.cliente_id}
              onChange={handleContratoChange}
              required
            >
              <option value="">Selecione um cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.razaoSocialEmpresa}
                </option>
              ))}
            </select>
          </div>

          {/* ITENS DO CONTRATO */}
          <h3>🧾 Serviços do Contrato</h3>

          {itens.map((item, index) => (
            <div key={index} className="produto-row">
              <select
                name="servico_id"
                value={item.servico_id}
                onChange={(e) => handleItemChange(index, e)}
                required
              >
                <option value="">Selecione o serviço</option>
                {servicos.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nome}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="quantidade"
                min="1"
                value={item.quantidade}
                onChange={(e) => handleItemChange(index, e)}
              />

              <input
                type="number"
                name="valor_unitario"
                step="0.01"
                value={item.valor_unitario}
                readOnly
              />

              <input type="text" value={item.subtotal} readOnly />

              {itens.length > 1 && (
                <button
                  type="button"
                  className="btn-remover"
                  onClick={() => removeItem(index)}
                >
                  ❌
                </button>
              )}
            </div>
          ))}

          <button type="button" className="btn-add" onClick={addItem}>
            ➕ Adicionar Serviço
          </button>

          {/* OBSERVAÇÕES */}
          <div className="form-group">
            <label>Observação:</label>
            <textarea
              name="observacao"
              value={contrato.observacao}
              onChange={handleContratoChange}
              placeholder="Informações adicionais..."
            />
          </div>

          {/* TOTAL */}
          <div className="total-display">
            <strong>Total do Contrato:</strong> R$ {contrato.valor_total}
          </div>

          {/* AÇÕES */}
          <div className="botoes-acoes">
            <button type="submit" className="btn-salvar">
              💾 Salvar Contrato
            </button>

            <button
              type="button"
              className="btn-voltar"
              onClick={() => navigate("/contrato")}
            >
              ⬅️ Voltar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default RegistroContrato;
