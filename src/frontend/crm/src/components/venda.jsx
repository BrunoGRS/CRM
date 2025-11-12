import React, { useState, useEffect } from "react";
import "./css/venda.css";
import { Navbar } from "./navbar.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function RegistroVenda() {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [itens, setItens] = useState([
    { produto_id: "", quantidade: 1, valor_unitario: 0, subtotal: 0 },
  ]);
  const [venda, setVenda] = useState({
    cliente_id: "",
    observacao: "",
    valor_total: 0,
  });

  const navigate = useNavigate();

  // Atualiza total da venda
  useEffect(() => {
    const total = itens.reduce(
      (acc, item) => acc + Number(item.subtotal || 0),
      0
    );
    setVenda((prev) => ({ ...prev, valor_total: total.toFixed(2) }));
  }, [itens]);

  const handleVendaChange = (e) => {
    const { name, value } = e.target;
    setVenda({ ...venda, [name]: value });
  };

  // Busca clientes e produtos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resClientes, resProdutos] = await Promise.all([
          fetch("http://localhost:3000/api/cliente/listar"),
          fetch("http://localhost:3000/api/produto/listar"),
        ]);

        const clientesData = await resClientes.json();
        const produtosData = await resProdutos.json();

        setClientes(Array.isArray(clientesData.msg) ? clientesData.msg : []);
        setProdutos(Array.isArray(produtosData.msg) ? produtosData.msg : []);
      } catch {
        toast.error("Erro ao carregar dados");
      }
    };
    fetchData();
  }, []);

  // Atualiza produto e recalcula subtotal
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItens = [...itens];
    updatedItens[index][name] = value;

    if (name === "produto_id") {
      const prod = produtos.find((p) => p.id === Number(value));
      if (prod) {
        updatedItens[index].valor_unitario = prod.preco;
      }
    }

    const qtd = parseFloat(updatedItens[index].quantidade || 0);
    const unit = parseFloat(updatedItens[index].valor_unitario || 0);
    updatedItens[index].subtotal = (qtd * unit).toFixed(2);

    setItens(updatedItens);
  };

  // Adiciona linha de produto
  const addItem = () => {
    setItens([
      ...itens,
      { produto_id: "", quantidade: 1, valor_unitario: 0, subtotal: 0 },
    ]);
  };

  // Remove linha de produto
  const removeItem = (index) => {
    const updatedItens = itens.filter((_, i) => i !== index);
    setItens(updatedItens);
  };

  // Envia para o back-end
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!venda.cliente_id || itens.length === 0) {
      toast.warn("Selecione o cliente e adicione pelo menos um produto.");
      return;
    }

    const payload = {
      cliente_id: venda.cliente_id,
      vendedor_id: 1,
      data_venda: new Date(),
      valor_total: venda.valor_total,
      observacao: venda.observacao,
      itens,
    };

    try {
      const response = await fetch("http://localhost:3000/api/venda/criar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 201) {
        toast.success("Venda registrada com sucesso!");
        navigate("/venda");
      } else {
        toast.error("Erro ao registrar venda");
      }
    } catch {
      toast.error("Erro ao salvar venda");
    }
  };

  return (
    <section className="venda-page">
      <Navbar />
      <div className="venda-wrapper">
        <h2>💼 Registro de Venda</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Cliente:</label>
            <select
              name="cliente_id"
              value={venda.cliente_id}
              onChange={handleVendaChange}
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

          <h3>🧾 Itens da Venda</h3>
          {itens.map((item, index) => (
            <div key={index} className="produto-row">
              <select
                name="produto_id"
                value={item.produto_id}
                onChange={(e) => handleItemChange(index, e)}
                required
              >
                <option value="">Selecione o produto</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
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
            ➕ Adicionar Produto
          </button>

          <div className="form-group">
            <label>Observação:</label>
            <textarea
              name="observacao"
              value={venda.observacao}
              onChange={handleVendaChange}
              placeholder="Informações adicionais..."
            />
          </div>

          <div className="total-display">
            <strong>Total da Venda:</strong> R$ {venda.valor_total}
          </div>

          <div className="botoes-acoes">
            <button type="submit" className="btn-salvar">
              💾 Salvar Venda
            </button>
            <button
              type="button"
              className="btn-voltar"
              onClick={() => navigate("/venda")}
            >
              ⬅️ Voltar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default RegistroVenda;
